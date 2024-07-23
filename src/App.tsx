import { useRef, useState } from 'react'
import logo from './assets/labelfusion.jpeg'
import './App.css'
import { PDFDocument, RotationTypes, StandardFonts, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import pdfToText from 'react-pdftotext'

function App() {
    const pdfInputRef = useRef(null)
    const [incPackingSlip, setIncPackingSlip] = useState(false)
    const [incThankYou, setIncThankYou] = useState(false)

    const handwritingFontUrl = '/CoveredByYourGrace-Regular.ttf'

    const readFile = (
        file: File
    ): Promise<{ pdfDoc: PDFDocument; pdfText: string }> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = async function (event) {
                if (event.target) {
                    const arrayBuffer = event?.target.result as ArrayBuffer

                    const typedArray = new Uint8Array(arrayBuffer)
                    const pdfDoc = await PDFDocument.load(typedArray)

                    const pdfText = await pdfToText(file)

                    resolve({ pdfDoc, pdfText })
                }
            }

            reader.onerror = () => {
                reject('Could not read file')
            }

            reader.readAsArrayBuffer(file)
        })
    }

    const generatePdf = async () => {
        if (pdfInputRef.current) {
            const files = (pdfInputRef.current as HTMLInputElement).files

            if (files !== null && files?.length > 0) {
                const combinedPdf = await PDFDocument.create()
                const timesRomanFont = await combinedPdf.embedFont(
                    StandardFonts.TimesRoman
                )
                const fontBytes = await fetch(handwritingFontUrl).then((res) =>
                    res.arrayBuffer()
                )
                combinedPdf.registerFontkit(fontkit)
                const customFont = await combinedPdf.embedFont(fontBytes)

                for (let i = 0; i < files.length; i++) {
                    const { pdfDoc, pdfText } = await readFile(files[i])

                    const [lastPage] = await combinedPdf.copyPages(pdfDoc, [
                        pdfDoc.getPageCount() - 1,
                    ])

                    if (incPackingSlip) {
                        const pageDims = lastPage.getSize()

                        const lines = pdfText
                            .split(/(?<!Livestream )(Name:)|  /g)
                            .filter((l) => l !== undefined && l !== '')
                        console.log(lines)
                        const packingSlip = combinedPdf.addPage([
                            pageDims.width,
                            pageDims.height,
                        ])
                        const fontSize = 12
                        let numLines = 0
                        const itemsStart = lines.indexOf('Name:')
                        for (let j = 0; j < itemsStart; j++) {
                            packingSlip.drawText(lines[j], {
                                x: 10,
                                y: pageDims.height - numLines * fontSize - 20,
                                size: fontSize,
                                lineHeight: fontSize,
                                font: timesRomanFont,
                                color: rgb(0, 0, 0),
                                maxWidth: pageDims.width - 20,
                                wordBreaks: [' '],
                            })
                            numLines =
                                numLines + Math.ceil(lines[j].length / 50)
                        }
                        numLines++
                        packingSlip.drawText('Items:', {
                            x: 10,
                            y: pageDims.height - numLines * fontSize - 20,
                            size: fontSize,
                            font: timesRomanFont,
                            color: rgb(0, 0, 0),
                        })
                        numLines++
                        packingSlip.drawLine({
                            start: {
                                x: 10,
                                y: pageDims.height - numLines * fontSize - 15,
                            },
                            end: {
                                x: pageDims.width - 10,
                                y: pageDims.height - numLines * fontSize - 15,
                            },
                            thickness: 2,
                            color: rgb(0, 0, 0),
                            opacity: 0.75,
                        })
                        numLines++
                        for (let j = itemsStart + 1; j < lines.length; j++) {
                            packingSlip.drawText(lines[j], {
                                x: 10,
                                y: pageDims.height - numLines * fontSize - 20,
                                size: fontSize,
                                font: timesRomanFont,
                                color: rgb(0, 0, 0),
                            })
                            numLines++
                            const nextItem = lines.indexOf('Name:', j)
                            if (nextItem === -1) {
                                break
                            }
                            j = nextItem
                        }

                        if (incThankYou) {
                            packingSlip.drawText('Thank you for\nyour order!', {
                                x: pageDims.width / 2,
                                y: pageDims.height / 4,
                                size: fontSize * 2,
                                font: customFont,
                                color: rgb(0, 0, 0),
                                rotate: {
                                    angle: 45,
                                    type: RotationTypes.Degrees,
                                },
                            })
                        }
                    }

                    combinedPdf.addPage(lastPage)
                }

                const pdfBytes = await combinedPdf.save()
                const blob = new Blob([pdfBytes], { type: 'application/pdf' })
                const url = URL.createObjectURL(blob)
                window.open(url)
            }
        }
    }

    return (
        <>
            <div>
                <a href="/">
                    <img src={logo} className="logo" alt="LabelFusion logo" />
                </a>
            </div>
            <div className="card">
                <input
                    type="file"
                    id="pdfs"
                    accept=".pdf"
                    multiple={true}
                    ref={pdfInputRef}
                />
                <button onClick={generatePdf}>Generate</button>
            </div>
            <div className="card">
                <h2>Options:</h2>
                <input
                    type="checkbox"
                    id="usePackingSlip"
                    onClick={(e) => setIncPackingSlip(e.target.checked)}
                />
                <label htmlFor="usePackingSlip">
                    Include packing slips [Experimental]
                </label>
                <br />
                <input
                    type="checkbox"
                    id="useThankYou"
                    onClick={(e) => setIncThankYou(e.target.checked)}
                />
                <label htmlFor="useThankYou">
                    Include thank you note on packing slip [Experimental]
                </label>
            </div>
            <div className="card">
                <h2>How to use:</h2>
                <p>
                    Click "Choose Files" to select your combined packing
                    list/shipping label PDF files. You may select as many files
                    as you need to combine. Click "Generate" to create a
                    combined PDF that contains just the shipping labels from the
                    last page of the PDFs.
                </p>
                <p>
                    The process happens entirely in your browser. No data about
                    your PDFs are ever uploaded anywhere.
                </p>
            </div>
        </>
    )
}

export default App
