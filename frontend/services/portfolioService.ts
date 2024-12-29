export const sendItemCount = async (itemName: string, count: number) => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("No token found");
      return;
    }
    const response = await fetch(
      `http://127.0.0.1:8000/api/portfolio/set_item_count/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: itemName,
          count: count,
        }),
      }
    );
    console.log("Response: ", response);
    if (response.ok) {
      console.log("Response ok");
    } else {
      console.log(
        `Bad status code: ${response.statusText} (${response.status})`
      );
    }
  } catch (error) {
    console.error("Error fetching item data:", error);
    console.log("Error fetching item data");
  }
};
