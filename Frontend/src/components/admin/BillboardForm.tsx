import React, { useEffect, useState } from "react";

interface BillboardFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>; // ✅ CHANGED
  initialData?: any;
}

export default function BillboardForm({
  onClose,
  onSubmit,
  initialData,
}: BillboardFormProps) {
  const [form, setForm] = useState({
    location: "",
    neighborhood: "",
    category: "",
    pricePerMonth: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // ✅ FILE
  const [preview, setPreview] = useState(""); // ✅ PREVIEW

  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  // ✅ Prefill (edit)
  useEffect(() => {
    if (initialData) {
      setForm({
        location: initialData.location || "",
        neighborhood: initialData.neighborhood || "",
        category: initialData.category || "",
        pricePerMonth: initialData.pricePerMonth || "",
      });

      setPreview(initialData.image); // show existing image
    }
  }, [initialData]);

  // ✅ INPUT CHANGE
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ FILE CHANGE
  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file)); // preview
    }
  };

  // ✅ VALIDATION
  const validate = () => {
    const newErrors: any = {};

    if (!form.location) newErrors.location = "Required";
    if (!form.neighborhood) newErrors.neighborhood = "Required";
    if (!form.category) newErrors.category = "Required";
    if (!form.pricePerMonth) newErrors.pricePerMonth = "Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("location", form.location);
      formData.append("neighborhood", form.neighborhood);
      formData.append("category", form.category);
      formData.append("pricePerMonth", form.pricePerMonth);

      if (imageFile) {
        formData.append("image", imageFile); // ✅ IMPORTANT
      }

      await onSubmit(formData);

      setSuccess("Saved successfully ✅");

      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Billboard" : "Add Billboard"}
        </h2>

        {success && (
          <div className="mb-3 text-green-600 text-sm font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TEXT FIELDS */}
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full border p-2 rounded"
          />
          {errors.location && <p className="text-red-500 text-xs">{errors.location}</p>}

          <input
            name="neighborhood"
            value={form.neighborhood}
            onChange={handleChange}
            placeholder="Neighborhood"
            className="w-full border p-2 rounded"
          />
          {errors.neighborhood && <p className="text-red-500 text-xs">{errors.neighborhood}</p>}

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="w-full border p-2 rounded"
          />
          {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}

          <input
            name="pricePerMonth"
            value={form.pricePerMonth}
            onChange={handleChange}
            type="number"
            placeholder="Price"
            className="w-full border p-2 rounded"
          />
          {errors.pricePerMonth && (
            <p className="text-red-500 text-xs">{errors.pricePerMonth}</p>
          )}

          {/* ✅ IMAGE UPLOAD */}
          <input type="file" accept="image/*" onChange={handleImageChange} />

          {/* ✅ PREVIEW */}
          {preview && (
            <img
              src={preview}
              className="h-32 w-full object-cover rounded"
            />
          )}

          {/* BUTTONS */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded bg-indigo-600 text-white flex items-center gap-2"
            >
              {loading && (
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
              )}
              {loading
                ? "Saving..."
                : initialData
                ? "Update"
                : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}