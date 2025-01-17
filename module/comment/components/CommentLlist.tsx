import React from "react";
import { Comment } from "@/module/comment/interface";
import { useQuery } from "@tanstack/react-query";
import { getCommentByPostId } from "@/module/comment/commentApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarUserPlaceholder } from "@/constants";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const CommentList = ({ post_id }: { post_id: number }) => {
  const {
    data: comments = [],
    isLoading,
    isError,
    error,
  } = useQuery<Comment[]>(["comments", post_id], () =>
    getCommentByPostId(post_id),
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="bg-red-50 border-red-200 text-red-700 p-4 rounded-lg">
        <CardTitle className="text-lg font-semibold mb-2">
          Error fetching comments
        </CardTitle>
        <CardContent>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(error, null, 2)}
          </pre>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Comments</h2>
        <span className="text-lg font-medium text-gray-600">
          <MessageCircle className="inline-block mr-2" />
          {comments.length}
        </span>
      </div>
      {comments.length === 0 ? (
        <Card className="bg-gray-50 border-gray-200 p-4 rounded-lg">
          <CardContent className="text-center text-gray-600">
            No comments found for this post.
          </CardContent>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {comments.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="comment">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={avatarUserPlaceholder}
                        alt={item.name}
                      />
                      <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {item.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{item.email}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-800 leading-relaxed">{item.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default CommentList;
