import api from "./api";

/*
|--------------------------------------------------------------------------
| Types & Interfaces
|--------------------------------------------------------------------------
*/

export interface StoryUser {
  _id: string;
  name?: string;
  username: string;
  profilePicture?: string;
  accountType?: "public" | "private";
  isVerified?: boolean;
}

export interface StoryMedia {
  url: string;
  type: "image" | "video";
  thumbnail?: string;
}

export interface StoryViewer {
  user: StoryUser | string;
  viewedAt: string;
}

export interface StoryReaction {
  user: StoryUser | string;
  emoji: string;
  reactedAt: string;
}

export interface StoryItem {
  _id: string;
  user?: StoryUser;
  media: StoryMedia;
  caption?: string;
  privacy: "public" | "followers" | "close_friends";
  viewers?: StoryViewer[];
  viewsCount?: number;
  reactions?: StoryReaction[];
  reactionsCount?: number;
  isHighlight?: boolean;
  createdAt: string;
  expiresAt: string;
  isOwnStory?: boolean;
  isViewed?: boolean;
  myReaction?: string | null;
}

export interface FeedStoryGroup {
  user: StoryUser;
  isOwnStory: boolean;
  hasUnseen: boolean;
  latestStoryCreatedAt: string;
  stories: StoryItem[];
}

export interface UserStoriesResponse {
  user: StoryUser;
  isOwnStory: boolean;
  hasUnseen: boolean;
  stories: StoryItem[];
}

export interface StoryMediaInput {
  uri: string;
  name?: string;
  type?: string;
}

/*
|--------------------------------------------------------------------------
| 1️⃣ Create Story
|--------------------------------------------------------------------------
*/
export const createStory = async (
  media: StoryMediaInput,
  caption?: string,
  privacy: "public" | "followers" | "close_friends" = "followers"
): Promise<StoryItem> => {
  try {
    const formData = new FormData();

    // Default media naming and mime typing
    const fileType = media.type || (media.uri.endsWith(".mp4") ? "video/mp4" : "image/jpeg");
    const fileName = media.name || (fileType.startsWith("video") ? "story_video.mp4" : "story_image.jpg");

    // @ts-ignore
    formData.append("media", {
      uri: media.uri,
      name: fileName,
      type: fileType,
    });

    if (caption) {
      formData.append("caption", caption);
    }
    formData.append("privacy", privacy);

    const response = await api.post("/stories", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Create story error:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| 2️⃣ Get Feed Stories (Home Story Tray / Reel)
|--------------------------------------------------------------------------
| Returns active stories from followed users and current user,
| grouped by user and sorted with own stories / unseen stories first.
*/
export const getFeedStories = async (): Promise<FeedStoryGroup[]> => {
  try {
    const response = await api.get("/stories/feed");
    return response.data;
  } catch (error) {
    console.error("Get feed stories error:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| 3️⃣ Get Stories By User ID (Profile Stories / User Tray)
|--------------------------------------------------------------------------
| Fetches all active stories of a specific user.
| Returns full viewer details if the logged-in user is the story owner.
*/
export const getStoriesByUserId = async (userId: string): Promise<UserStoriesResponse> => {
  try {
    const response = await api.get(`/stories/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Get stories by user ID error:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| 4️⃣ Get Single Story By Story ID (Direct Link / Single View)
|--------------------------------------------------------------------------
| Fetches a single story document by its story ID.
*/
export const getStoryById = async (storyId: string): Promise<StoryItem> => {
  try {
    const response = await api.get(`/stories/${storyId}`);
    return response.data;
  } catch (error) {
    console.error("Get story by ID error:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| 5️⃣ Mark Story As Viewed
|--------------------------------------------------------------------------
| Records the current user's view on the story.
*/
export const markStoryAsViewed = async (
  storyId: string
): Promise<{ message: string; isViewed: boolean; viewsCount: number }> => {
  try {
    const response = await api.post(`/stories/${storyId}/view`, {});
    return response.data;
  } catch (error) {
    console.error("Mark story as viewed error:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| 6️⃣ React To Story
|--------------------------------------------------------------------------
| Send emoji reaction or pass null/empty string to remove reaction.
*/
export const reactToStory = async (
  storyId: string,
  emoji: string | null
): Promise<{ message: string; myReaction: string | null; reactionsCount: number }> => {
  try {
    const response = await api.post(`/stories/${storyId}/react`, { emoji });
    return response.data;
  } catch (error) {
    console.error("React to story error:", error);
    throw error;
  }
};

/*
|--------------------------------------------------------------------------
| 7️⃣ Delete Story
|--------------------------------------------------------------------------
*/
export const deleteStory = async (storyId: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/stories/${storyId}`);
    return response.data;
  } catch (error) {
    console.error("Delete story error:", error);
    throw error;
  }
};

export default {
  createStory,
  getFeedStories,
  getStoriesByUserId,
  getStoryById,
  markStoryAsViewed,
  reactToStory,
  deleteStory,
};
