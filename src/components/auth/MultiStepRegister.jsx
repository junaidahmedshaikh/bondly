"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/Card";
import { INTERESTS, BACKEND_URL } from "../../utils/constant";
import { useDispatch } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

const MultiStepRegister = ({ onSwitchToLogin }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    location: "",
    password: "",
    confirmPassword: "",
    bio: "",
    interests: [],
    photos: [],
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + formData.photos.length > 5) {
      toast.error("You can upload a maximum of 5 photos");
      return;
    }

    const newPhotos = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos],
    }));
  };

  const removePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
    }

    // Validate step requirements before moving to next step
    if (currentStep === 1) {
      // Validate step 1 fields
      if (
        !formData.name ||
        !formData.email ||
        !formData.age ||
        !formData.location ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        toast.error("Please fill in all required fields");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
    }

    if (currentStep < 3) {
      console.log("Moving from step", currentStep, "to step", currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Only submit on step 3
    if (currentStep !== 3) {
      return;
    }

    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = "Passwords don't match";
      setError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("age", formData.age);
      formDataToSend.append("location", formData.location);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("bio", formData.bio);
      formDataToSend.append("interests", JSON.stringify(formData.interests));

      // Add photo files
      formData.photos.forEach((photo, index) => {
        console.log(`Adding photo ${index}:`, photo.file.name);
        formDataToSend.append("photos", photo.file);
      });

      const res = await fetch(`${BACKEND_URL}/signup`, {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        // Handle error response
        setError(data.message);
        toast.error(data.message);
      } else if (data.user) {
        // Success
        toast.success("Registration successful! Redirecting...");
        dispatch(login(data.user));
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        const errorMsg = "Registration failed. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg = "Registration failed. Please try again. " + err.message;
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Signup error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Name</label>
          <Input
            placeholder="Your name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Age</label>
          <Input
            type="number"
            placeholder="25"
            value={formData.age}
            onChange={(e) => handleInputChange("age", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Email</label>
        <Input
          type="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Location</label>
        <Input
          placeholder="City, State"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <Input
          type="password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          required
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Bio</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Interests</label>
        <div className="grid grid-cols-3 gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleInterest(interest)}
              className={`px-3 py-2 text-xs rounded-full border transition-colors ${
                formData.interests.includes(interest)
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-white text-gray-700 border-gray-300 hover:border-pink-300"
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Add Your Photos ({formData.photos.length}/5)
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Upload up to 5 photos to make your profile stand out
          <span className="text-gray-500 ml-1">(Optional)</span>
        </p>

        {/* Photo Preview Grid */}
        {formData.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img
                  src={photo.preview}
                  alt={`Preview ${index}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            onChange={handlePhotoSelect}
            disabled={formData.photos.length >= 5}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => document.getElementById("photo-upload")?.click()}
            disabled={formData.photos.length >= 5}
            className={`flex flex-col items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg transition-colors ${
              formData.photos.length >= 5
                ? "border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed"
                : "border-pink-300 hover:border-pink-500 bg-pink-50 hover:bg-pink-100 cursor-pointer"
            }`}
          >
            <div className="text-center">
              <span className="text-2xl">📸</span>
              <p className="text-sm font-medium text-gray-700 mt-2">
                Click to upload photos
              </p>
              <p className="text-xs text-gray-600">PNG, JPG, GIF up to 5MB</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Card className="w-full bg-white/50 max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">
          Join Bondly
        </CardTitle>
        <p className="text-gray-600">Step {currentStep} of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (currentStep === 3) {
              handleSubmit(e);
            }
          }}
        >
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between mt-6 gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  handleBack();
                }}
              >
                Back
              </Button>
            )}

            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleNext(e);
                }}
                className="ml-auto text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isLoading}
                className="ml-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                onClick={(e) => {
                  console.log(
                    "Submit button clicked, photos:",
                    formData.photos.length
                  );
                  handleSubmit(e);
                }}
              >
                {isLoading ? "Creating Account..." : "Complete Registration"}
              </Button>
            )}
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              onClick={onSwitchToLogin}
              className="text-pink-600 hover:text-pink-500 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MultiStepRegister;
