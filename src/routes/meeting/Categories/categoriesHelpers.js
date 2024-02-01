import { apiMutate } from "unity-fluent-library"

export const CreateCategory = async (newCategory, group_id) => {
    try {
      const data = {
        data: { Title: newCategory.Title, group_id: group_id },
        method: "POST"
      }

      const response = await apiMutate(
        process.env.REACT_APP_MEETING_MINUTES_API_BASE,
        `cpsCategory`,
        data
      );
      return response;
    } catch (error) {
      handleErrorSnackbar(error, "Error creating category");
    }
  }

