"use client";

import { useNavigation, useSelect } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";

export default function BlogPostCreate() {
  const { list } = useNavigation();

  const {
    refineCore: { onFinish },
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  const { options: categoryOptions } = useSelect({
    resource: "categories",
  });

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>Create</h1>
        <div>
          <button
            onClick={() => {
              list("blog_posts");
            }}
          >
            List
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit(onFinish)}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <label>
            <span style={{ marginRight: "8px" }}>title</span>
            <input
              type="text"
              {...register("title", {
                required: "This field is required",
              })}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.title?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Content</span>
            <textarea
              rows={5}
              cols={33}
              style={{ verticalAlign: "top" }}
              {...register("content", {
                required: "This field is required",
              })}
            />
            <span style={{ color: "red" }}>
              {(errors as any)?.content?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Category</span>
            <select
              {...register("category.id", {
                required: "This field is required",
              })}
            >
              {categoryOptions?.map((option) => (
                <option value={option.value} key={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <span style={{ color: "red" }}>
              {(errors as any)?.category?.id?.message as string}
            </span>
          </label>
          <label>
            <span style={{ marginRight: "8px" }}>Status</span>
            <select
              defaultValue={"draft"}
              {...register("status", {
                required: "This field is required",
              })}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="rejected">Rejected</option>
            </select>
            <span style={{ color: "red" }}>
              {(errors as any)?.status?.message as string}
            </span>
          </label>
          <div>
            <input type="submit" value="save" />
          </div>
        </div>
      </form>
    </div>
  );
}
