"use client";

import { useToast } from "@/app/features/toast/hooks/useToast";
import CarImage from "@/app/shared/ui/Image";
import { formatNumber } from "@/app/shared/utils/numberFormatter";
import { getMyCars } from "@/app/shared/utils/API/CarAPI";
import {
  createPost,
  deletePostById,
  myPost,
  updatePostById,
} from "@/app/shared/utils/API/PostAPI";
import {
  AlertTriangle,
  ArrowLeft,
  Car,
  CheckCircle2,
  ChevronRight,
  Fuel,
  Gauge,
  Pencil,
  PenLine,
  Plus,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CursorResponse } from "@/app/shared/types.ts/cursor-response";
import { CarModel } from "@/app/features/car/types/car.model";
import { carMapper } from "@/app/features/car/types/car.mapper";
import { PostModel } from "@/app/features/post/types/post.model";
import { PostMapper } from "@/app/features/post/types/post.mapper";

export const dynamic = "force-dynamic";
// ─── types ──────────────────────────────────────────────────────────────────

type Step = "list" | "select-car" | "write-post";

// ─── helpers ────────────────────────────────────────────────────────────────

const VISIBILITY_OPTIONS = ["Public", "Private"] as const;
type Visibility = (typeof VISIBILITY_OPTIONS)[number];

// ─── sub-components ─────────────────────────────────────────────────────────

/** Single car selection card used in step 1 */
const SelectableCarCard = ({
  car,
  selected,
  onSelect,
}: {
  car: CarModel;
  selected: boolean;
  onSelect: (car: CarModel) => void;
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(car)}
      className={`group relative flex w-full flex-col overflow-hidden rounded-xl border-2 text-left transition-all duration-200 hover:shadow-md ${
        selected
          ? "border-primary-500 shadow-primary-100 bg-primary-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      {/* selected badge */}
      {selected && (
        <div className="absolute top-2 right-2 z-10">
          <CheckCircle2 className="text-primary-500 h-6 w-6 drop-shadow" />
        </div>
      )}

      {/* image */}
      <div className="relative h-40 w-full overflow-hidden bg-gray-100">
        {car.imageUrl ? (
          <CarImage
            src={car.imageUrl}
            alt={car.title}
            width={400}
            height={160}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Car className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* info */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-1 font-bold text-gray-900">{car.title}</h3>
        <p className="text-sm text-gray-500">
          {car.make} {car.model}
        </p>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Gauge className="h-3.5 w-3.5" />
            {formatNumber(car.mileage)} km
          </span>
        </div>
        <p className="mt-1 text-sm font-semibold text-gray-800">
          ฿{formatNumber(car.price)}
        </p>
      </div>
    </button>
  );
};

/** Step indicator */
const StepBadge = ({
  step,
  label,
  active,
  done,
}: {
  step: number;
  label: string;
  active: boolean;
  done: boolean;
}) => (
  <div className="flex items-center gap-2">
    <div
      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
        done
          ? "bg-primary text-white"
          : active
            ? "bg-primary-500 text-white"
            : "bg-gray-200 text-gray-500"
      }`}
    >
      {done ? <CheckCircle2 className="h-4 w-4" /> : step}
    </div>
    <span
      className={`text-sm font-medium ${active || done ? "text-gray-900" : "text-gray-400"}`}
    >
      {label}
    </span>
  </div>
);

// ─── post row in management list ─────────────────────────────────────────────

const PostRow = ({
  post,
  onDelete,
  onEdit,
  deletingId,
}: {
  post: PostModel;
  onDelete: (id: string) => void;
  onEdit: (post: PostModel) => void;
  deletingId: string | null;
}) => {
  const firstImage = post.carDto?.images?.[0]?.url;
  const isDeleting = deletingId === post.id;
  return (
    <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {firstImage ? (
          <Image
            src={firstImage}
            alt={post.carDto?.title ?? "car"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Car className="h-6 w-6 text-gray-300" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-1 font-semibold text-gray-900">
          {post.caption}
        </p>
        <p className="line-clamp-1 text-sm text-gray-500">{post.content}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-gray-400">
          <span>
            {post.carDto?.make} {post.carDto?.model} · {post.carDto?.year}
          </span>
          <span
            className={`rounded-full ${post.visibility === "Public" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"} px-2 py-0.5`}
          >
            {post.visibility}
          </span>
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="flex gap-4 text-sm text-gray-500">
        <span>Seen: {post.viewCount}</span>
        <span>Like: {post.likeCount}</span>
      </div>
      <div className="flex shrink-0 items-center gap-2 text-xs text-gray-500">
        <button
          type="button"
          onClick={() => onEdit(post)}
          className="ml-2 rounded-lg p-1.5 text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
          title="Edit post"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(post.id)}
          disabled={isDeleting}
          className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          title="Delete post"
        >
          {isDeleting ? (
            <RotateCcw className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

// ─── edit post modal ─────────────────────────────────────────────────────────

const EditPostModal = ({
  post,
  onClose,
  onSaved,
  addToastMessage,
}: {
  post: PostModel;
  onClose: () => void;
  onSaved: (updated: Partial<PostModel>) => void;
  addToastMessage: (type: "success" | "error" | "info", msg: string) => void;
}) => {
  const [caption, setCaption] = useState(post.caption);
  const [content, setContent] = useState(post.content);
  const [visibility, setVisibility] = useState<Visibility>(
    (post.visibility as Visibility) ?? "Public",
  );
  const [saving, setSaving] = useState(false);
  const MAX_CAPTION = 150;
  const MAX_CONTENT = 1000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePostById(post.id, { caption, content, visibility });
      addToastMessage("success", "Post updated successfully!");
      setTimeout(() => {});
      onSaved({ caption, content, visibility });
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.errorMessage ??
        err?.message ??
        "Failed to update post.";
      addToastMessage("error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        {/* modal header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Pencil className="text-primary-500 h-5 w-5" />
            <h2 className="text-lg font-bold text-gray-900">Edit Post</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* car summary */}
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-50 px-6 py-3">
          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-200">
            {post.carDto?.images?.[0]?.url ? (
              <Image
                src={post.carDto.images[0].url}
                alt={post.carDto.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Car className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="line-clamp-1 text-sm font-semibold text-gray-900">
              {post.carDto?.title}
            </p>
            <p className="text-xs text-gray-400">
              {post.carDto?.make} {post.carDto?.model} · {post.carDto?.year}
            </p>
          </div>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          {/* caption */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center justify-between text-sm font-semibold text-gray-600">
              <span>
                Caption <span className="text-red-500">*</span>
              </span>
              <span
                className={`text-xs ${caption.length > MAX_CAPTION ? "text-red-500" : "text-gray-400"}`}
              >
                {caption.length}/{MAX_CAPTION}
              </span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={MAX_CAPTION}
              required
              autoFocus
              className="focus:ring-primary rounded-lg border border-gray-200 px-4 py-2 text-gray-900 transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-green-50 focus:ring-1 focus:outline-none"
            />
          </div>

          {/* content */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center justify-between text-sm font-semibold text-gray-600">
              <span>
                Description <span className="text-red-500">*</span>
              </span>
              <span
                className={`text-xs ${content.length > MAX_CONTENT ? "text-red-500" : "text-gray-400"}`}
              >
                {content.length}/{MAX_CONTENT}
              </span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={MAX_CONTENT}
              rows={4}
              required
              className="focus:ring-primary w-full resize-none rounded-lg border border-gray-200 px-4 py-2 text-gray-900 transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-green-50 focus:ring-1 focus:outline-none"
            />
          </div>

          {/* visibility */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-600">
              Visibility
            </label>
            <div className="flex gap-3">
              {VISIBILITY_OPTIONS.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setVisibility(v)}
                  className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                    visibility === v
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* actions */}
          <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-5 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !caption.trim() || !content.trim()}
              className="bg-primary hover:bg-primary-600 flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white shadow transition-all disabled:cursor-not-allowed disabled:opacity-40"
            >
              {saving ? (
                <RotateCcw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── main component ──────────────────────────────────────────────────────────

const PostManagement = () => {
  // dashboard state
  const [step, setStep] = useState<Step>("list");
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // step 1 — car selection
  const [cars, setCars] = useState<CarModel[]>([]);
  const [loadingCars, setLoadingCars] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);
  const [selectedCar, setSelectedCar] = useState<CarModel | null>(null);
  const [carCursor, setCarCursor] = useState<string | undefined>();
  const [hasMoreCars, setHasMoreCars] = useState(false);

  // delete state
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // edit state
  const [editingPost, setEditingPost] = useState<PostModel | null>(null);

  // step 2 — post form
  const [caption, setCaption] = useState("");
  const [content, setContent] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("Public");
  const [submitting, setSubmitting] = useState(false);

  const { addToastMessage, removeToastMessage } = useToast({
    toastType: null,
    message: null,
  });

  const captionRef = useRef<HTMLInputElement>(null);
  const MAX_CAPTION = 150;
  const MAX_CONTENT = 1000;

  // ── fetch my posts ──────────────────────────────────────────────────────
  const fetchMyPosts = async () => {
    setLoadingPosts(true);
    setPostsError(null);
    try {
      const res = await myPost();
      const data: CursorResponse<PostModel[]> = {
        items: res.data.items.map(PostMapper),
        hasMore: res.data.hasMore,
        nextCursor: res.data.nextCursor,
      };

      if (!data) throw new Error("No data returned");
      setPosts(data?.items ?? []);
    } catch (err: any) {
      const msg =
        err?.response?.data?.errorMessage ??
        err?.message ??
        "Failed to load posts. Please try again.";
      setPostsError(msg);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  // ── fetch dealer's approved cars ────────────────────────────────────────
  const fetchCars = async (cursor: string | null = null) => {
    setLoadingCars(true);
    setCarsError(null);
    try {
      const res = await getMyCars("Approved", cursor);
      const data = res?.data;
      if (!data) throw new Error("No data returned");
      const items: CursorResponse<CarModel[]> = {
        items: data.items.map(carMapper),
        hasMore: data.hasMore,
        nextCursor: data.nextCursor,
      };
      setCars((prev) => (cursor ? [...prev, ...items.items] : items.items));
      setCarCursor(data?.nextCursor ?? undefined);
      setHasMoreCars(data?.hasMore ?? false);
    } catch (err: any) {
      const msg =
        err?.response?.data?.errorMessage ??
        err?.message ??
        "Failed to load vehicles. Please try again.";
      setCarsError(msg);
      if (!cursor) setCars([]);
    } finally {
      setLoadingCars(false);
    }
  };

  // ── start create flow ───────────────────────────────────────────────────
  const startCreate = () => {
    setSelectedCar(null);
    setCaption("");
    setContent("");
    setVisibility("Public");
    setDeleteError(null);
    setCarsError(null);
    setCars([]);
    fetchCars(null);
    setStep("select-car");
  };

  // ── submit post ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCar) return;
    setSubmitting(true);
    try {
      await createPost({
        caption,
        content,
        carId: selectedCar.id,
        visibility,
      });
      addToastMessage("success", "Post published successfully!");
      setTimeout(() => {
        removeToastMessage();
      }, 2500);
      await fetchMyPosts();
      setStep("list");
    } catch (err: any) {
      const msg =
        err?.response?.data?.errorMessage ??
        err?.response?.data?.message ??
        err?.message ??
        "Failed to publish post. Please try again.";
      addToastMessage("error", msg);
      setTimeout(() => {
        removeToastMessage();
      }, 2500);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // optimistic removal
    const snapshot = posts;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    setDeletingId(id);
    setDeleteError(null);
    try {
      await deletePostById(id);
    } catch (err: any) {
      // rollback on failure
      setPosts(snapshot);
      const msg =
        err?.response?.data?.errorMessage ??
        err?.message ??
        "Failed to delete post. Please try again.";
      setDeleteError(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // ── render ───────────────────────────────────────────────────────────────

  // ── Step: dashboard list ────────────────────────────────────────────────
  if (step === "list") {
    return (
      <>
        {editingPost && (
          <EditPostModal
            post={editingPost}
            onClose={() => setEditingPost(null)}
            addToastMessage={addToastMessage}
            onSaved={(updated) => {
              setPosts((prev) =>
                prev.map((p) =>
                  p.id === editingPost.id ? { ...p, ...updated } : p,
                ),
              );
            }}
          />
        )}
        <div className=" bg-linear-to-br max-h-full min-h-screen from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {/* header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Post Management
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your vehicle posts and reach more buyers
                </p>
              </div>
              <button
                type="button"
                onClick={startCreate}
                className="bg-primary hover:bg-primary-600 flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white shadow-sm transition-colors"
              >
                <Plus className="h-5 w-5" />
                New Post
              </button>
            </div>

            {/* posts error banner */}
            {postsError && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{postsError}</span>
                <button
                  type="button"
                  onClick={fetchMyPosts}
                  className="flex items-center gap-1 rounded-lg border border-red-300 bg-white px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                >
                  <RotateCcw className="h-3 w-3" /> Retry
                </button>
              </div>
            )}

            {/* delete error banner */}
            {deleteError && (
              <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span className="flex-1">{deleteError}</span>
                <button
                  type="button"
                  onClick={() => setDeleteError(null)}
                  className="ml-auto text-xs font-semibold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* posts */}
            {loadingPosts ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 animate-pulse rounded-xl bg-gray-200"
                  />
                ))}
              </div>
            ) : postsError && posts.length === 0 ? null : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white py-20 text-center">
                <PenLine className="mb-4 h-12 w-12 text-gray-300" />
                <p className="text-lg font-semibold text-gray-500">
                  No posts yet
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Create your first post to showcase a vehicle
                </p>
                <button
                  type="button"
                  onClick={startCreate}
                  className="bg-primary hover:bg-primary-600 mt-6 flex items-center gap-2 rounded-lg px-5 py-2.5 font-semibold text-white shadow transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Create Post
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post) => (
                  <PostRow
                    deletingId={deletingId}
                    key={post.id}
                    post={post}
                    onDelete={handleDelete}
                    onEdit={setEditingPost}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Step 1: select car ──────────────────────────────────────────────────
  if (step === "select-car") {
    return (
      <div className=" bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* back */}
          <button
            type="button"
            onClick={() => setStep("list")}
            className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to posts
          </button>

          {/* progress */}
          <div className="mb-8 flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm">
            <StepBadge step={1} label="Select Vehicle" active done={false} />
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <StepBadge
              step={2}
              label="Write Post"
              active={false}
              done={false}
            />
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="border-primary-500 mb-6 border-l-4 pl-4">
              <h2 className="text-xl font-bold text-gray-900">
                Select a Vehicle
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose one of your approved vehicles to feature in this post
              </p>
            </div>

            {loadingCars && cars.length === 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-xl bg-gray-200"
                  />
                ))}
              </div>
            ) : carsError && cars.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <AlertTriangle className="mb-3 h-12 w-12 text-red-300" />
                <p className="font-semibold text-gray-700">
                  Failed to load vehicles
                </p>
                <p className="mt-1 text-sm text-gray-400">{carsError}</p>
                <button
                  type="button"
                  onClick={() => fetchCars(null)}
                  className="mt-4 flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <RotateCcw className="h-4 w-4" /> Retry
                </button>
              </div>
            ) : cars.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Car className="mb-3 h-12 w-12 text-gray-300" />
                <p className="font-semibold text-gray-500">
                  No approved vehicles found
                </p>
                <p className="mt-1 text-sm text-gray-400">
                  Your cars must be approved before you can post them
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cars.map((car) => (
                  <SelectableCarCard
                    key={car.id}
                    car={car}
                    selected={selectedCar?.id === car.id}
                    onSelect={setSelectedCar}
                  />
                ))}
              </div>
            )}

            {/* load more error */}
            {carsError && cars.length > 0 && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{carsError}</span>
                <button
                  type="button"
                  onClick={() => fetchCars(carCursor)}
                  className="ml-auto flex items-center gap-1 text-xs font-semibold hover:underline"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Retry
                </button>
              </div>
            )}

            {/* load more */}
            {hasMoreCars && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => fetchCars(carCursor)}
                  disabled={loadingCars}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  {loadingCars ? (
                    <RotateCcw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Load more
                </button>
              </div>
            )}

            {/* next */}
            <div className="mt-8 flex justify-end border-t border-gray-100 pt-6">
              <button
                type="button"
                disabled={!selectedCar}
                onClick={() => {
                  setStep("write-post");
                  setTimeout(() => captionRef.current?.focus(), 100);
                }}
                className="bg-primary-500 hover:bg-primary-600 flex items-center gap-2 rounded-xl px-6 py-2.5 font-semibold text-white shadow transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: write post ──────────────────────────────────────────────────
  return (
    <>
      <div className=" bg-linear-to-br from-gray-50 to-gray-100 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* back */}
          <button
            type="button"
            onClick={() => setStep("list")}
            className="mb-6 flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to vehicle selection
          </button>

          {/* progress */}
          <div className="mb-8 flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-sm">
            <StepBadge step={1} label="Select Vehicle" active={false} done />
            <ChevronRight className="h-4 w-4 text-gray-300" />
            <StepBadge step={2} label="Write Post" active done={false} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 rounded-2xl bg-white p-6 shadow-xl sm:p-8"
          >
            <div className="border-primary-500 border-l-4 pl-4">
              <h2 className="text-xl font-bold text-gray-900">
                Write Your Post
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Add a caption and description for your vehicle post
              </p>
            </div>

            {/* selected car summary */}
            {selectedCar && (
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-200">
                  {selectedCar.imageUrl ? (
                    <Image
                      src={selectedCar.imageUrl}
                      alt={selectedCar.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Car className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="line-clamp-1 font-semibold text-gray-900">
                    {selectedCar.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedCar.make} {selectedCar.model}· ฿
                    {formatNumber(selectedCar.price)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep("select-car")}
                  className="ml-auto shrink-0 text-xs text-gray-400 hover:text-gray-700 hover:underline"
                >
                  Change
                </button>
              </div>
            )}

            {/* caption */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center justify-between text-sm font-semibold text-gray-600">
                <span>
                  Caption <span className="text-red-500">*</span>
                </span>
                <span
                  className={`text-xs ${caption.length > MAX_CAPTION ? "text-red-500" : "text-gray-400"}`}
                >
                  {caption.length}/{MAX_CAPTION}
                </span>
              </label>
              <input
                ref={captionRef}
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={MAX_CAPTION}
                placeholder="e.g., Stunning 2022 Toyota Camry — barely driven!"
                required
                className="focus:ring-primary rounded-lg border border-gray-200 px-4 py-2 text-gray-900 transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-green-50 focus:ring-1 focus:outline-none"
              />
            </div>

            {/* content / description */}
            <div className="flex flex-col gap-1">
              <label className="flex items-center justify-between text-sm font-semibold text-gray-600">
                <span>
                  Description <span className="text-red-500">*</span>
                </span>
                <span
                  className={`text-xs ${content.length > MAX_CONTENT ? "text-red-500" : "text-gray-400"}`}
                >
                  {content.length}/{MAX_CONTENT}
                </span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CONTENT}
                rows={5}
                placeholder="Describe the vehicle's highlights, condition, reason for selling…"
                required
                className="focus:ring-primary w-full resize-none rounded-lg border border-gray-200 px-4 py-2 text-gray-900 transition-all placeholder:text-sm placeholder:text-gray-400 focus:bg-green-50 focus:ring-1 focus:outline-none"
              />
            </div>

            {/* visibility */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-600">
                Visibility
              </label>
              <div className="flex gap-3">
                {VISIBILITY_OPTIONS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVisibility(v)}
                    className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition-colors ${
                      visibility === v
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* actions */}
            <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setStep("list")}
                className="rounded-lg border border-gray-300 px-5 py-2 font-semibold text-gray-600 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !caption.trim() || !content.trim()}
                className="bg-primary hover:bg-primary-600 flex items-center gap-2 rounded-lg px-6 py-2 font-semibold text-white shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (
                  <RotateCcw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {submitting ? "Publishing…" : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PostManagement;
