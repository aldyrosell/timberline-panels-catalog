import { defineCliConfig } from "sanity/cli";

import { dataset, projectId, studioHost } from "./projectConfig";

export default defineCliConfig({
  api: { projectId, dataset },
  studioHost,
});
