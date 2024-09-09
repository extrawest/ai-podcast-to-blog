import { VertexAI } from "@google-cloud/vertexai";

const project = process.env.GCLOUD_PROJECT || "";
const location = process.env.GCLOUD_LOCATION || "";

export const vertexAI = new VertexAI({ project, location });

export default {
  vertexAI,
};
