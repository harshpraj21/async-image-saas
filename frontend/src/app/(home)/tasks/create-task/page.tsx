"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z
    .any()
    .refine((file) => file?.length === 1, "Image is required"),
})

type FormData = z.infer<typeof formSchema>

export default function CreateTaskPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const imageFile = watch("image")?.[0]

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data)
    // You can use FormData to send image + metadata to backend here
  }

  // Show preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4 p-4">
      <div>
        <Label htmlFor="title" className="py-3">Title</Label>
        <Input id="title" placeholder="Enter image title" {...register("title")} />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="flex flex-col items-start gap-5 py-4">
        <Input
          type="file"
          accept="image/*"
          {...register("image")}
          onChange={handleImageChange}

        />
        {errors.image && (
          <p className="text-sm text-red-500">{errors.image.message as string}</p>
        )}
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-40 h-40 object-cover rounded-md border"
          />
        )}
      </div>

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}
