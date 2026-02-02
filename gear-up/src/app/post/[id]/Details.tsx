"use client";

import { CommentData } from "@/app/types/comment.types";
import { PostItem } from "@/app/types/post.types";
import {
  getCommentsByPostId,
  getNestedCommentsByCommentId,
} from "@/utils/API/CommentAPI";
import * as signalR from "@microsoft/signalr";
import { useEffect } from "react";
import { Comment } from "../discover/Comment";
import { CarouselImages, PostContent } from "../discover/DiscoverPost";
import { useCommentContext } from "./CommentContext";

interface IDetailProp {
  access_token: string;
  postData: PostItem;
}

const Details = ({ access_token, postData }: IDetailProp) => {
  /*
      Data flow 

    1. This page will handle data fetching from the server using the id param
    2. Connect the real-time and listen updates using signalR
    3. Minipulate the data and update context stores

  	
	
	
  */
  const { comments, handleComment, requestedParentCommentId } =
    useCommentContext();

  const { make, model, year, color } = postData.carDto;
  const basicSpecTableData = [
    { Make: make },
    { Model: model },
    { Year: year },
    { Color: color },
  ];

  const { engineCapacity, fuelType, transmissionType } = postData.carDto;
  const performanceSpecTableData = [
    { EngineCapacity: engineCapacity },
    { FuelType: fuelType },
    { TransmissionType: transmissionType },
  ];

  const { mileage, seatingCapacity } = postData.carDto;
  const capacitySpecTableData = [
    { Mileage: mileage + " km" },
    { SeatingCapacity: seatingCapacity + " seats" },
  ];
  const fetchComments = async (postId: string) => {
    const response = await getCommentsByPostId(postId);
    handleComment(response?.data, null);
  };

  const fetchNestedComments = async (requestedParentCommentId: string) => {
    const response = await getNestedCommentsByCommentId(requestedParentCommentId);
    handleComment(response?.data, requestedParentCommentId);
  };

  useEffect(() => {
    // Comment fetch on initial load
    fetchComments(postData.id);
  }, []);

  useEffect(() => {
    // Fetch nested comments when requestedParentCommentId changes
    if (!requestedParentCommentId) return;
    fetchNestedComments(requestedParentCommentId);
  }, [requestedParentCommentId, postData.id]);

  // SignalR connection for real-time comments
  useEffect(() => {
    if (!postData.id) {
      console.log("Id doesn't exist");
      return;
    }

    // SignalR connection start
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5255/hubs/post", {
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

    connection.on("CommentCreated", (data: CommentData) => {
      handleComment(data, data.parentCommentId ?? null);
    });

    connection.on("CommentLikeUpdated", (data) => {
      console.log(data);
    });

    return () => {
      connection.off("CommentCreated");
      connection.stop();
    };
  }, []);

  if (!postData) {
    return <h3>Loading...</h3>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-6">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="flex flex-col lg:flex-row h-full">
            {/* Post Content Section */}
            <div className="flex-1 lg:max-w-2xl">
              <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                <div
                  className="overflow-y-auto"
                  style={{
                    scrollbarWidth: "none",
                    maxHeight: "calc(100vh - 8rem)",
                  }}
                >
                  {/* Header Section */}
                  <div className="px-6 py-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                      {postData.caption}
                    </h1>
                    <PostContent postContent={postData.content} />
                  </div>

                  {/* Image Carousel */}
                  <div className="bg-gray-100">
                    <CarouselImages images={postData.carDto.carImages} />
                  </div>

                  {/* Specifications Section */}
                  <div className="px-6 py-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                      Vehicle Specifications
                    </h2>
                    <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-primary-500 to-primary-600">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
                              Features
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-white uppercase tracking-wider">
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
                                className="hover:bg-gray-50 transition-colors"
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
                          {performanceSpecTableData.map((d, i) => {
                            const [key, value] = Object.entries(d)[0];

                            return (
                              <tr
                                key={i}
                                className="hover:bg-gray-50 transition-colors"
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
                          {capacitySpecTableData.map((d, i) => {
                            const [key, value] = Object.entries(d)[0];

                            return (
                              <tr
                                key={i}
                                className="hover:bg-gray-50 transition-colors"
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
                className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden"
                style={{ height: "calc(100vh - 8rem)" }}
              >
                {/* Comments Header */}
                <div className="px-6 py-3 border-b border-gray-200 bg-white">
                  <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
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

export default Details;
