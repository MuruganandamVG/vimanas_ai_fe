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

  return (
    <div className="grid grid-cols-1 gap-4">
      <div>
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
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

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register("phone")} />
      </div>

      <div>
        <Label htmlFor="position">Position Applied For</Label>
        <Input id="position" {...register("position")} />
      </div>

      <div>
        <Label htmlFor="experience">Experience Level</Label>
        <Input id="experience" {...register("experience")} />
      </div>

      <div>
        <Label htmlFor="skills">Skills (comma-separated)</Label>
        <Textarea id="skills" rows={3} {...register("skills")} />
      </div>
    </div>
  );
};
