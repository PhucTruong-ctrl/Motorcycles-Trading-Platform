import supabase from "../supabase-client";

export const uploadAvatarToSupabase = async (imageUrl, userId) => {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error("Failed to fetch image");

    const contentType = response.headers.get("Content-Type");
    const fileExt = contentType?.split("/")[1] || "jpg";
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const blob = await response.blob();

    const folderPath = `${userId}/${fileName}`;
    const { data, error } = await supabase.storage
      .from("user-media")
      .upload(folderPath, blob, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("user-media").getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return null;
  }
};

export const handleUserCreation = async (
  user,
  isEmailSignup = false,
  formData
) => {
  try {
    const { data: existingUser, error: selectError } = await supabase
      .from("USER")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();

    if (selectError) throw selectError;

    if (!existingUser) {
      let avatarUrl =
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture?.data?.url;

      if (avatarUrl) {
        avatarUrl = await uploadAvatarToSupabase(avatarUrl, user.id);
      }

      const userData = {
        uid: user.id,
        email: user.email,
        name: isEmailSignup
          ? formData.name
          : user.user_metadata?.full_name || user.email.split("@")[0],
        avatar_url: avatarUrl,
        ...(isEmailSignup && {
          phone_num: formData.phone_num,
          citizen_id: formData.citizen_id,
          birthdate: formData.birthdate,
          is_man: formData.is_man,
          password: formData.password,
        }),
        badge: "New to the market!",
      };

      const { error: insertError } = await supabase
        .from("USER")
        .insert([userData])
        .single();

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error("Error in user creation:", error);
    throw error;
  }
};
