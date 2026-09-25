"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent, ChartBar, ChartGrid } from "@/components/ui/chart"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState(5000)
  const [loanTerm, setLoanTerm] = useState(24)
  const [traditionalRate, setTraditionalRate] = useState(18)
  const [pollenRate, setPollenRate] = useState(9)

  const [traditionalPayment, setTraditionalPayment] = useState(0)
  const [pollenPayment, setPollenPayment] = useState(0)
  const [totalSavings, setTotalSavings] = useState(0)

  useEffect(() => {
    // Calculate monthly payment using the formula: P = L[c(1 + c)^n]/[(1 + c)^n - 1]
    // where P is the payment, L is the loan amount, c is the monthly interest rate, and n is the number of payments
    const calculateMonthlyPayment = (amount: number, rate: number, months: number) => {
      const monthlyRate = rate / 100 / 12
      return (amount * (monthlyRate * Math.pow(1 + monthlyRate, months))) / (Math.pow(1 + monthlyRate, months) - 1)
    }

    const tPayment = calculateMonthlyPayment(loanAmount, traditionalRate, loanTerm)
    const pPayment = calculateMonthlyPayment(loanAmount, pollenRate, loanTerm)

    setTraditionalPayment(tPayment)
    setPollenPayment(pPayment)
    setTotalSavings((tPayment - pPayment) * loanTerm)
  }, [loanAmount, loanTerm, traditionalRate, pollenRate])

  return (
    <div className="bg-gray-50 rounded-2xl p-8 shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold text-[#003366] mb-6">Loan Calculator</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Loan Amount</label>
                <span className="text-sm font-medium text-[#003366]">${loanAmount.toLocaleString()}</span>
              </div>
              <Slider
                value={[loanAmount]}
                min={1000}
                max={50000}
                step={500}
                onValueChange={(value) => setLoanAmount(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>$1,000</span>
                <span>$50,000</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Loan Term (Months)</label>
                <span className="text-sm font-medium text-[#003366]">{loanTerm} months</span>
              </div>
              <Slider
                value={[loanTerm]}
                min={6}
                max={60}
                step={6}
                onValueChange={(value) => setLoanTerm(value[0])}
                className="my-4"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>6 months</span>
                <span>60 months</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Traditional Bank</p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={traditionalRate}
                      onChange={(e) => setTraditionalRate(Number(e.target.value))}
                      min="5"
                      max="30"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <span className="ml-2 text-gray-700">%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Pollen AI</p>
                  <div className="flex items-center">
                    <input
                      type="number"
                      value={pollenRate}
                      onChange={(e) => setPollenRate(Number(e.target.value))}
                      min="3"
                      max="15"
                      step="0.5"
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <span className="ml-2 text-gray-700">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-[#003366] mb-6">Comparison Results</h3>

          <div className="h-[200px] mb-6">
            <ChartContainer
              data={[
                { name: "Traditional Bank", value: traditionalPayment },
                { name: "Pollen AI", value: pollenPayment },
              ]}
            >
              <Chart>
                <ChartGrid className="stroke-gray-200" />
                <ChartBar
                  className="fill-gray-400 data-[state=active]:fill-gray-500"
                  dataKey="value"
                  variant="grouped"
                  target="name"
                  valueFormatter={(value) => `$${(value || 0).toFixed(2)}`}
                />
                <ChartTooltip>
                  {({ dataPoint }) => (
                    <ChartTooltipContent>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium">
                          {dataPoint.name}: ${(dataPoint.value || 0).toFixed(2)}/month
                        </span>
                      </div>
                    </ChartTooltipContent>
                  )}
                </ChartTooltip>
              </Chart>
            </ChartContainer>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-gray-200">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Traditional Bank</p>
                <p className="text-2xl font-bold text-gray-700">${traditionalPayment.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Monthly payment</p>
              </CardContent>
            </Card>
            <Card className="border border-[#00CC66]/20 bg-[#00CC66]/5">
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">Pollen AI</p>
                <p className="text-2xl font-bold text-[#00CC66]">${pollenPayment.toFixed(2)}</p>
                <p className="text-xs text-gray-500">Monthly payment</p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">Total Interest Savings</p>
              <p className="text-lg font-bold text-[#00CC66]">${totalSavings.toFixed(2)}</p>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-[#00CC66] h-2.5 rounded-full"
                  style={{
                    width: `${Math.min(100, ((traditionalPayment - pollenPayment) / traditionalPayment) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-right">
                {(((traditionalPayment - pollenPayment) / traditionalPayment) * 100).toFixed(1)}% lower monthly payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

