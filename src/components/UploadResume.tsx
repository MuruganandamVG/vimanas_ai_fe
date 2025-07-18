import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { useToast } from "../hooks/use-toast";
import { Upload, FileText, X, Check } from "lucide-react";
import { candidatesAPI } from "../services/api";
import type { CandidateDetails } from "../interfaces/candidate";
import { CandidateFieldsForm } from "./CandidateDetailsForm";
const UploadResume = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const methods = useForm<CandidateDetails>();

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files;
    const file = files && files.length > 0 ? files[0] : null;
    if (!file) return;

    if (file.type !== "application/pdf" && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file format",
        description: "Please upload a PDF or image file",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      setUploadedFile(file);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error?.response?.data?.detail || "Failed to upload resume",
        variant: "destructive",
      });
      setUploadedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
  };

  const onSubmit = async (data: CandidateDetails) => {
    if (!uploadedFile) {
      toast({
        title: "Missing information",
        description: "Please upload resume ",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const payload = {
        ...data,
        skills: data.skills?.split(",").map((s) => s.trim()),
      };

      const candidate = await candidatesAPI.create(payload);

      toast({
        title: "Resume processed successfully",
        description: "Candidate information saved. Ready to create interview.",
      });

      // Navigate to create interview with candidate data
      navigate("/create", {
        state: {
          candidateDetails: data,
          resumeFile: uploadedFile.name,
          candidate,
        },
      });
    } catch (error: any) {
      console.error("Error processing resume:", error);
      toast({
        title: "Processing failed",
        description: error.response?.data?.detail || "Failed to process resume",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Resume</h1>
        <p className="text-gray-600">
          Upload candidate resume and extract information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
          </CardHeader>
          <CardContent>
            {!uploadedFile ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                  disabled={isProcessing}
                />
                <label
                  htmlFor="resume-upload"
                  className={`cursor-pointer ${
                    isProcessing ? "pointer-events-none" : ""
                  }`}
                >
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    {isProcessing
                      ? "Uploading..."
                      : "Drop resume here or click to browse"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Supports PDF, JPG, PNG files up to 10MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-green-600">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5 text-green-600" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Information */}
        <Card>
          <CardHeader>
            <CardTitle>Candidate Information</CardTitle>
          </CardHeader>
          <CardContent>
            <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <CandidateFieldsForm />
                <Button
                  type="submit"
                  disabled={isProcessing || !uploadedFile}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isProcessing ? "Processing..." : "Process Resume & Continue"}
                </Button>
              </form>
            </FormProvider>
          </CardContent>
          s
        </Card>
      </div>
    </div>
  );
};

export default UploadResume;
