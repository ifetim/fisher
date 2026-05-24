// src/app/api/student-saver/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { analyzeStatement } from '@/lib/analyzeStatement'

/** Extract readable text from a PDF buffer without any npm library.
 *  PDFs store page content in streams between BT/ET markers.
 *  This pulls out every text string (inside parentheses after Tj/TJ/') 
 *  and joins them with spaces — good enough for digital bank statements. */
function extractTextFromPDF(buffer: Buffer): string {
  const raw = buffer.toString('latin1')

  // Decode a PDF string: handle \n \r \t \\ \( \) and octal escapes
  function decodePdfString(s: string): string {
    return s.replace(/\\([nrtbf\\()])|\\(\d{3})/g, (_, esc, oct) => {
      if (oct) return String.fromCharCode(parseInt(oct, 8))
      const map: Record<string, string> = { n: '\n', r: '\r', t: '\t', b: '\b', f: '\f', '\\': '\\', '(': '(', ')': ')' }
      return map[esc] ?? esc
    })
  }

  const chunks: string[] = []

  // Match all BT...ET blocks (text blocks in PDF content streams)
  const btEt = /BT[\s\S]*?ET/g
  let block: RegExpExecArray | null

  while ((block = btEt.exec(raw)) !== null) {
    const content = block[0]

    // Tj operator: (text) Tj
    const tj = /\(([^)]*)\)\s*Tj/g
    let m: RegExpExecArray | null
    while ((m = tj.exec(content)) !== null) {
      chunks.push(decodePdfString(m[1]))
    }

    // TJ operator: [(text) ...] TJ  — array of strings and kerning numbers
    const tjArray = /\[([^\]]*)\]\s*TJ/g
    while ((m = tjArray.exec(content)) !== null) {
      const inner = m[1]
      const strings = /\(([^)]*)\)/g
      let s: RegExpExecArray | null
      while ((s = strings.exec(inner)) !== null) {
        chunks.push(decodePdfString(s[1]))
      }
    }

    // ' operator (move to next line and show text): (text) '
    const quote = /\(([^)]*)\)\s*'/g
    while ((m = quote.exec(content)) !== null) {
      chunks.push(decodePdfString(m[1]))
    }

    // After each BT block, add a newline so lines don't run together
    chunks.push('\n')
  }

  return chunks.join('').trim()
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('statement') as File | null
    const campus = (form.get('campus') as string) || undefined

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded. Please attach a PDF bank statement.' },
        { status: 400 },
      )
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported.' },
        { status: 415 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const pdfText = extractTextFromPDF(buffer)

    console.log('[student-saver] extracted text length:', pdfText.length)
    console.log('[student-saver] first 300 chars:', pdfText.slice(0, 300))

    if (!pdfText || pdfText.trim().length < 20) {
      return NextResponse.json(
        { error: 'No readable text found. Please upload a digital (non-scanned) bank statement.' },
        { status: 422 },
      )
    }

    const result = analyzeStatement(pdfText, campus)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[/api/student-saver]', err)
    return NextResponse.json(
      { error: 'Unexpected error. Please try again.' },
      { status: 500 },
    )
  }
}