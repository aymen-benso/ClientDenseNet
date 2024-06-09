import React, { useState } from "react"
import { ResponsiveBar } from "@nivo/bar"

interface PredictionResponse {
  prediction: number[][];
}

export function Dense() {
  const [prediction, setPrediction] = useState<number[][] | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    const formData = new FormData()
    formData.append("file", selectedFile)

    try {
      const response = await fetch("http://localhost:8000/predict/", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload file")
      }

      const data: PredictionResponse = await response.json()
      setPrediction(data.prediction)
    } catch (error) {
      console.error("Error uploading file:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white py-4 px-6 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <ClipboardIcon className="w-6 h-6" />
            <h1 className="text-xl font-bold">Radiology Interface</h1>
          </div>
        </div>
      </header>
      <main className="flex-1 bg-gray-800 dark:bg-gray-800 py-12">
        <div className="container mx-auto px-6">
          <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-4">Upload Medical Image</h2>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12">
              <UploadIcon className="w-12 h-12 text-gray-500 dark:text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Drag and drop your medical image here or
                <button className="text-blue-500 hover:text-blue-600 font-medium">browse</button>
                your local files.
              </p>
              <div className="flex items-center justify-center w-full">
                <input
                  accept="image/*"
                  className=""
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                />

              </div>
              <button
                onClick={handleUpload}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg"
              >
                Upload
              </button>
            </div>
          </div>
          {prediction && (
            <div className="bg-white dark:bg-gray-400 rounded-lg shadow-md p-8 mt-8">
              <h2 className="text-2xl font-bold mb-4">Prediction Results</h2>
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <BarChart className="aspect-[16/9]" data={prediction} />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

interface BarChartProps {
  data: number[][];
  className?: string;
}

function BarChart({ data, ...props }: BarChartProps) {
  const formattedData = data
    ? [
        { name: "Class 1", count: data[0][0] },
        { name: "Class 2", count: data[0][1] },
      ]
    : []

  return (
    <div {...props}>
      <ResponsiveBar
        data={formattedData}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "black",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  )
}

function ClipboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  )
}
