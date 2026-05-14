"use client";

import {
  getCommentsByPostId,
  getNestedCommentsByCommentId,
} from "@/app/shared/utils/API/CommentAPI";
import * as signalR from "@microsoft/signalr";
import { useCallback, useEffect } from "react";
import { Comment } from "../../comment/ui/Comment";
import { CarouselImages, PostContent } from "./DiscoverPost";
import { useCommentContext } from "../../comment/context/CommentContext";
import { PostModel } from "../types/post.model";
import { CommentModel } from "../../comment/types/comment.model";
import { Skeleton, SkeletonText } from "@/app/shared/ui/Skeleton";

interface IDetailProp {
  access_token: string;
  postData: PostModel;
}

const PostDetails = ({ access_token, postData }: IDetailProp) => {
  /*
      Data flow 

    1. This page will handle data fetching from the server using the id param
    2. Connect the real-time and listen updates using signalR
    3. Minipulate the data and update context stores

  	
	
	
  */
  const { comments, handleComment, requestedParentCommentId } =
    useCommentContext();

  const car = postData.carDto ?? {};
  const { make, model, year, color } = car as Record<string, unknown>;
  const basicSpecTableData = car
    ? [{ Make: make }, { Model: model }, { Year: year }, { Color: color }]
    : [];

  const { engine, fuel, transmission } = car as Record<string, unknown>;
  const performanceSpecTableData = car
    ? [
        { EngineCapacity: engine },
        { FuelType: fuel },
        { TransmissionType: transmission },
      ]
    : [];

  const { mileage, seats } = car as Record<string, unknown>;
  const capacitySpecTableData = car
    ? [{ Mileage: mileage + " km" }, { SeatingCapacity: seats + " seats" }]
    : [];
  const fetchComments = useCallback(
    async (postId: string) => {
      const response = await getCommentsByPostId(postId);
      handleComment(response?.data, null);
    },
    [handleComment],
  );

  const fetchNestedComments = useCallback(
    async (requestedParentCommentId: string) => {
      const response = await getNestedCommentsByCommentId(
        requestedParentCommentId,
      );
      handleComment(response?.data, requestedParentCommentId);
    },
    [handleComment],
  );

  useEffect(() => {
    // Comment fetch on initial load
    fetchComments(postData.id);
  }, [fetchComments, postData.id]);

  useEffect(() => {
    // Fetch nested comments when requestedParentCommentId changes
    if (!requestedParentCommentId) return;
    fetchNestedComments(requestedParentCommentId);
  }, [fetchNestedComments, requestedParentCommentId]);

  // SignalR connection for real-time comments
  useEffect(() => {
    if (!postData.id) {
      console.log("Id doesn't exist");
      return;
    }

    // SignalR connection start
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${process.env.NEXT_Backend_URL}/hubs/post`, {
        accessTokenFactory: () => access_token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Join group to Commnet Group
    const JoinGroups = async () => {
      await connection.start().catch((err) => console.error(err));

      try {
        await connection.invoke("JoinGroup", postData.id);
        await connection.invoke("JoinCommentsGroup", postData.id);
      } catch (err) {
        console.error("Join group error:: ", err);
      }
    };
    // Join Group
    JoinGroups();

    connection.on("CommentCreated", (data: CommentModel) => {
      handleComment(data, data.parentCommentId ?? null);
    });

    connection.on("CommentLikeUpdated", (data) => {
      console.log(data);
    });

    return () => {
      connection.off("CommentCreated");
      connection.stop();
    };
  }, [postData.id, access_token, handleComment]);

  if (!postData) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-full flex-col lg:flex-row">
            <div className="flex-1 lg:max-w-2xl">
              <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div className="border-b border-gray-200 px-6 py-6 space-y-3">
                  <Skeleton className="h-8 w-2/3" />
                  <SkeletonText className="w-full" />
                  <SkeletonText className="w-4/5" />
                </div>
                <Skeleton className="aspect-video w-full" />
                <div className="px-6 py-6 space-y-3">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-48 w-full rounded-xl" />
                </div>
              </div>
            </div>
            <div className="flex-1 lg:max-w-md">
              <div className="overflow-hidden border border-gray-200 bg-white shadow-md" style={{ height: "100vh" }}>
                <div className="border-b border-gray-200 px-6 py-3">
                  <SkeletonText className="w-1/4" />
                </div>
                <div className="space-y-4 px-4 py-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <SkeletonText className="w-1/3" />
                        <SkeletonText className="w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-full flex-col lg:flex-row">
          <div className="flex h-full flex-col lg:flex-row">
            {/* Post Content Section */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
                <div
                  className="overflow-y-auto"
                  style={{
                    scrollbarWidth: "none",
                    maxHeight: "100vh",
                  }}
                >
                  {/* Header Section */}
                  <div className="border-b border-gray-200 bg-linear-to-r from-gray-50 to-white px-6 py-6">
                    <h1 className="mb-3 text-3xl leading-tight font-bold text-gray-900">
                      {postData.caption}
                    </h1>
                    <PostContent postContent={postData.content} />
                  </div>

                  {/* Image Carousel */}
                  {postData.carDto && (
                    <div className="bg-gray-100">
                      <CarouselImages
                        price={postData.carDto.price}
                        images={postData.carDto.images}
                      />
                    </div>
                  )}

                  {/* Specifications Section */}
                  <div className="px-6 py-6">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                      Vehicle Specifications
                    </h2>
                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full">
                        <thead className="from-primary-500 to-primary-600 bg-linear-to-r">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider text-white uppercase">
                              Features
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold tracking-wider text-white uppercase">
                              Descriptions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {basicSpecTableData.map((d, i) => {
                            const [key, value] = Object.entries(d)[0];

                            return (
                              <tr
                                key={i}
                                className="transition-colors hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                  {key}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {String(value ?? "")}
                                </td>
                              </tr>
                            );
                          })}
                          {performanceSpecTableData.map((d, i) => {
                            const [key, value] = Object.entries(d)[0];

                            return (
                              <tr
                                key={i}
                                className="transition-colors hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                  {key}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {String(value ?? "")}
                                </td>
                              </tr>
                            );
                          })}
                          {capacitySpecTableData.map((d, i) => {
                            const [key, value] = Object.entries(d)[0];

                            return (
                              <tr
                                key={i}
                                className="transition-colors hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-gray-700">
                                  {key}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {value}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="flex-1 lg:max-w-md">
              <div
                className="overflow-hidden border border-gray-200 bg-white shadow-md"
                style={{ height: "100vh" }}
              >
                {/* Comments Header */}
                <div className="border-b border-gray-200 bg-white px-6 py-3">
                  <h2 className="flex items-center gap-2 text-base font-semibold text-gray-800">
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Comments
                  </h2>
                </div>
                {/* Comments List */}
                <div
                  className="overflow-y-auto px-4 py-4"
                  style={{
                    scrollbarWidth: "thin",
                    height: "calc(100% - 4rem)",
                  }}
                >
                  <Comment comment={comments} level={0} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
