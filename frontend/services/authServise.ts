export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const logOut = async () => {
  console.log("logging out...");
  const refreshToken = localStorage.getItem("refresh_token");
  const accessToken = localStorage.getItem("access_token");

  if (refreshToken) {
    const response = await fetch("http://127.0.0.1:8000/api/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      clearTokens();
    } else {
      if (accessToken && response.status == 401) {
        clearTokens();
        console.log("Clearing expired tokens");
        
        return;
      }
      console.error("Logout failed with status:", response.status);
    }
  } else {
    console.log("No refresh token found.");
    if (accessToken) {
      console.log("Clearing access token");
      clearTokens();
    }
  }
};
