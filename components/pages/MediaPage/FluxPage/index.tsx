"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertErrorMessage } from "@/components/shared/AlertErrorMessage";

const FluxPage = () => {
    const [prompt, setPrompt] = useState("");
    const [responseFormat, setResponseFormat] = useState("url");
    const [selectedParams, setSelectedParams] = useState({ prompt, responseFormat });
    const [response, setResponse] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateFluxImage = async () => {
        setError(null);
        setResponse(null);
        setIsLoading(true);

        try {
            console.log("Request Payload:", { prompt, response_format: responseFormat });

            const token = "igaFpCB4SQcOyBUFlCJl0pKwMIUwZVECg8TVTnL8"; // Hardcoded token

            const res = await fetch("https://services.tetsuo.ai/api/v1/image/flux", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    prompt,
                    response_format: responseFormat,
                }),
            });

            console.log("Response Status:", res.status);

            if (!res.ok) {
                const errorData = await res.json();
                console.error("Error Response Body:", errorData);
                setError(errorData.detail || "Something went wrong.");
                return;
            }

            const data = await res.json();
            console.log("Parsed Response Data:", data);

            if (data?.url) {
                const fullUrl = new URL(data.url, "https://services.tetsuo.ai/").href;
                setResponse(fullUrl);
            } else {
                setError("Unexpected response format.");
            }
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err instanceof Error ? err.message : "Failed to generate Flux image.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 p-8 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold">Generate Flux Image</h1>

            {/* Selected Parameters */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Selected Parameters</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                    <p><strong>Prompt:</strong> {selectedParams.prompt}</p>
                    <p><strong>Response Format:</strong> {selectedParams.responseFormat}</p>
                </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
                <Textarea
                    placeholder="Enter your prompt"
                    value={prompt}
                    onChange={(e) => {
                        setPrompt(e.target.value);
                        setSelectedParams((prev) => ({ ...prev, prompt: e.target.value }));
                    }}
                    className="w-full"
                />

                <Button
                    onClick={handleGenerateFluxImage}
                    disabled={isLoading || !prompt.trim()}
                    variant="default"
                >
                    {isLoading ? "Generating..." : "Generate"}
                </Button>
            </div>

            {/* Error Message */}
            {error && <AlertErrorMessage message={error} />}

            {/* Response Display */}
            {response && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold">Generated Image:</h3>
                    <div className="mt-4">
                        <img src={response} alt="Generated Flux" className="rounded-md max-w-full" />
                        <p className="mt-2 text-sm text-muted">The image has been successfully generated and rendered below.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FluxPage;
