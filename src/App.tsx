import { useRef } from 'react'
import logo from './assets/labelfusion.jpeg'
import './App.css'
import { PDFDocument } from 'pdf-lib'

function App() {
    const pdfInputRef = useRef(null)

    const readFile = (file: File): Promise<PDFDocument> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.onload = async function (event) {
                if (event.target) {
                    const arrayBuffer = event?.target.result as ArrayBuffer

                    const typedArray = new Uint8Array(arrayBuffer)
                    const pdfDoc = await PDFDocument.load(typedArray)

                    resolve(pdfDoc)
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
            console.log(files)

            if (files !== null && files?.length > 0) {
                const combinedPdf = await PDFDocument.create()

                for (let i = 0; i < files.length; i++) {
                    const pdf = await readFile(files[i])

                    const [lastPage] = await combinedPdf.copyPages(pdf, [
                        pdf.getPageCount() - 1,
                    ])
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
