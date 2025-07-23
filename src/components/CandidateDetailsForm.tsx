// components/CandidateFields.tsx
import { useFormContext } from "react-hook-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { CandidateDetails } from "@/interfaces";
export const CandidateFieldsForm = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<CandidateDetails>();

  const positionOptions = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "DevOps Engineer",
    "QA Engineer",
    "UI/UX Designer",
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          {...register("email", {
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/, message: "Invalid email" },
          })}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors?.email?.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position Applied For</Label>
        <select
          id="position"
          {...register("position", { required: "Position is required" })}
          className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 text-sm"
        >
          <option value="">Select a position</option>
          {positionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.position && (
          <p className="text-red-600 text-sm">{errors.position.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experience">Experience Level</Label>
        <Input id="experience" {...register("experience")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Textarea id="skills" rows={3} {...register("skills")} />
      </div>
    </div>
  );
};
