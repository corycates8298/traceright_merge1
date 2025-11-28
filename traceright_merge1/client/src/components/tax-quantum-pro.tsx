import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

// --- Accessibility Hook Integration ---
// The user requested "useReducedMotion" to solve "33 infinite animations"
// If a user has "Reduce Motion" on, the app stops spinning.

export default function TaxQuantumPro() {
    const shouldReduceMotion = useReducedMotion();
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<'safe' | 'audit-risk' | null>(null);

    const runAnalysis = () => {
        setAnalyzing(true);
        // Simulate API call
        setTimeout(() => {
            setAnalyzing(false);
            setResult('safe');
        }, 2000);
    };

    // Animation variants
    const spinnerVariants = {
        animate: {
            rotate: 360,
            transition: {
                repeat: Infinity,
                duration: 1,
                ease: "linear"
            }
        },
        static: {
            rotate: 0
        }
    };

    const fadeInVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Tax Quantum Pro</h1>
                <p className="text-slate-500">AI-Powered Tax Compliance & Audit Defense</p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Upload & Analyze</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                        <p className="text-slate-600">Drag & drop tax documents (PDF, CSV)</p>
                    </div>

                    <div className="flex justify-center">
                        <Button
                            size="lg"
                            onClick={runAnalysis}
                            disabled={analyzing}
                            className="w-full md:w-auto min-w-[200px]"
                        >
                            {analyzing ? (
                                <div className="flex items-center gap-2">
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                        variants={spinnerVariants}
                                        animate={shouldReduceMotion ? "static" : "animate"}
                                    />
                                    <span>Analyzing...</span>
                                </div>
                            ) : (
                                "Run Quantum Analysis"
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {result && (
                <motion.div
                    initial={shouldReduceMotion ? "visible" : "hidden"}
                    animate="visible"
                    variants={fadeInVariants}
                >
                    {result === 'safe' ? (
                        <Alert className="bg-green-50 border-green-200">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <AlertTitle className="text-green-800">Compliance Verified</AlertTitle>
                            <AlertDescription className="text-green-700">
                                Your documents have passed the preliminary AI audit check. No anomalies detected.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Alert variant="destructive">
                            <AlertCircle className="h-5 w-5" />
                            <AlertTitle>Audit Risk Detected</AlertTitle>
                            <AlertDescription>
                                Potential inconsistencies found in deduction categories. Review recommended.
                            </AlertDescription>
                        </Alert>
                    )}
                </motion.div>
            )}

            {/* Accessibility Status Indicator (Debug) */}
            <div className="mt-8 text-xs text-slate-400">
                Accessibility Mode: {shouldReduceMotion ? "Reduced Motion (Active)" : "Standard Motion"}
            </div>
        </div>
    );
}
