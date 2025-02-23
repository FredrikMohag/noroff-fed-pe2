// Function to get avatar from localStorage
export const getAvatar = () => {
  try {
    const avatar = localStorage.getItem("avatar");
    return avatar ? JSON.parse(avatar) : null;
  } catch (error) {
    return null;
  }
};

export const setAvatar = (avatar) => {
  if (!avatar) {
    localStorage.removeItem("avatar");
  } else {
    try {
      localStorage.setItem("avatar", JSON.stringify(avatar));
    } catch (error) {
    }
  }

  updateProfileAvatarOnServer(avatar);
};

const updateProfileAvatarOnServer = async (avatar) => {
  const userName = getUserName();

  if (!userName) {
    return;
  }

  try {
    const response = await fetch(`/holidaze/profiles/${userName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update avatar: ${response.statusText}`);
    }

    const data = await response.json();
  } catch (error) {

  }
};
