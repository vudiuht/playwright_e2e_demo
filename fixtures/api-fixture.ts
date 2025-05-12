import { test as base } from "@playwright/test";
import apiClient from "../api/APIClient";


type MyFixtures = {
  api: apiClient;
};

const apiFixture = base.extend<MyFixtures>({
    api: async ({ request }, use) => {
      const API = new apiClient(request);
      await use(API);
    }
  });
  
  export { apiFixture };