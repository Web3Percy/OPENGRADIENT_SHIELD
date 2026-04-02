"use client"

import { Shield, AlertTriangle, CheckCircle2, Search, Loader2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Finding {
  issue: string
  status: string
}

interface AnalysisResult {
  address: string
  security_score: number
  risk_level: string
  findings: Finding[]
  recommendation: string
}

export default function Home() {
  const [contractAddress, setContractAddress] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!contractAddress.trim()) {
      setError("Please enter a contract address")
      return
    }

    if (!/^0x[a-fA-F0-9]{40}$/.test(contractAddress.trim())) {
      setError("Please enter a valid Ethereum contract address (e.g., 0x123...abc)")
      return
    }

    setError(null)
    setIsAnalyzing(true)
    setResult(null)

    try {
      const response = await fetch("http://localhost:8000/audit-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contract_address: contractAddress.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to audit contract")
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      console.error(err)
      setError("Failed to connect to analysis server. Showing simulated results.")
      setTimeout(() => {
        setResult({
          address: contractAddress,
          security_score: Math.floor(Math.random() * 100),
          risk_level: "High",
          findings: [
            { issue: "Honeypot", status: "Detected" },
            { issue: "Unverified Source", status: "Detected" },
            { issue: "Minting Function", status: "Detected" }
          ],
          recommendation: "The contract exhibits patterns commonly associated with malicious actors or has significant security flaws."
        })
      }, 1500)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[#48C6B6]" // Teal
    if (score >= 50) return "text-[#F18F3B]" // Orange
    return "text-red-500" // Red
  }

  const getBgColor = (score: number) => {
    if (score >= 80) return "bg-[#48C6B6]" // Teal
    if (score >= 50) return "bg-[#F18F3B]" // Orange
    return "bg-red-500" // Red
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 overflow-hidden relative font-sans text-gray-900">
      {/* Background colorful blurred mesh using OpenGradient palette */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#48C6B6]/20 blur-3xl filter opacity-60 mix-blend-multiply animate-blob pointer-events-none" />
      <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#4B79E4]/20 blur-3xl filter opacity-60 mix-blend-multiply animate-blob animation-delay-2000 pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-[#A436D2]/20 blur-3xl filter opacity-60 mix-blend-multiply animate-blob animation-delay-4000 pointer-events-none" />
      
      <div className="max-w-3xl w-full z-10">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-og-br mb-6 shadow-xl"
          >
            <Shield className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-gradient-og pb-1">
            OpenGradient Shield
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Verifiable AI Token Security Auditor
          </p>
        </div>

        {/* Glassmorphism main card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ backdropFilter: 'blur(10px)', background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)' }}
          className="rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] mb-8 overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">Rug Check</h2>
            <p className="text-gray-500 mb-8 text-lg">Enter an Ethereum contract address to begin the AI-powered security analysis.</p>
            
            <form onSubmit={handleAnalyze} className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6 group-focus-within:text-[#4B79E4] transition-colors" />
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full pl-14 pr-4 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-[#4B79E4]/20 focus:border-[#4B79E4] outline-none transition-all bg-white/50 backdrop-blur-sm"
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  disabled={isAnalyzing}
                />
              </div>
              <button 
                type="submit" 
                className="py-4 px-10 bg-gradient-og hover:opacity-90 text-white rounded-2xl font-bold text-lg transition-all shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#48C6B6]" />
                    Scanning...
                  </>
                ) : (
                  "Audit"
                )}
              </button>
            </form>
            <AnimatePresence>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm font-semibold text-red-500 mt-4 flex items-center gap-2"
                >
                  <AlertTriangle className="w-5 h-5" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] overflow-hidden border border-gray-100"
            >
              <div className={`h-3 w-full ${getBgColor(result.security_score)}`} />
              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
                  {/* Security Score Gauge */}
                  <div className="flex flex-col items-center justify-center w-48 h-48 rounded-full border-8 border-gray-50 relative shrink-0 shadow-inner">
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="88"
                        cy="88"
                        r="88"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="16"
                        className="text-gray-100"
                        transform="translate(8 8)"
                      />
                      <motion.circle
                        initial={{ strokeDasharray: "0 1000" }}
                        animate={{ strokeDasharray: `${(result.security_score / 100) * 553} 1000` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="88"
                        cy="88"
                        r="88"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="16"
                        strokeLinecap="round"
                        className={getScoreColor(result.security_score)}
                        transform="translate(8 8)"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-5xl font-black ${getScoreColor(result.security_score)}`}>{result.security_score}</span>
                      <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
                    </div>
                  </div>

                  {/* Summary & Reasoning */}
                  <div className="flex-1 text-center md:text-left flex flex-col justify-center h-full">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
                      {result.risk_level === 'Low' || result.security_score >= 80 ? (
                        <CheckCircle2 className="w-10 h-10 text-[#48C6B6]" />
                      ) : (
                        <AlertTriangle className={`w-10 h-10 ${result.security_score >= 50 ? 'text-[#F18F3B]' : 'text-red-500'}`} />
                      )}
                      <h3 className="text-3xl font-bold text-gray-900">
                        {result.risk_level} Risk
                      </h3>
                    </div>
                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                      {result.recommendation}
                    </p>
                  </div>
                </div>

                {/* Findings List */}
                {result.findings && result.findings.length > 0 ? (
                  <div className="p-6 rounded-2xl bg-gray-50/50 border border-gray-200">
                    <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2 text-lg">
                      <Shield className="w-5 h-5 text-gray-500" />
                      Findings
                    </h4>
                    <ul className="space-y-3">
                      {result.findings.map((finding, index) => (
                        <motion.li 
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between text-gray-700 font-medium bg-white p-3 rounded-xl shadow-sm border border-gray-100"
                        >
                          <span className="text-lg">{finding.issue}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            finding.status.toLowerCase() === 'safe' || finding.status.toLowerCase() === 'renounced' || finding.status.toLowerCase() === 'hidden/none'
                              ? 'bg-[#48C6B6]/20 text-[#48C6B6]'
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {finding.status}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-[#48C6B6]/10 border border-[#48C6B6]/20 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#48C6B6]/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-[#48C6B6]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#48C6B6] text-lg">Clean Scan</h4>
                      <p className="text-[#48C6B6]/80 font-medium">No obvious risk flags detected in this security analysis.</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
