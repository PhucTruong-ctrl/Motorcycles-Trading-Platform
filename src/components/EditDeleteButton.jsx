import React from "react";
import { useNavigate } from "react-router"; // Sửa import
import supabase from "../supabase-client";

const EditDeleteButton = ({ motoUID, motoID, currentUserId }) => {
  const navigate = useNavigate();
  if (currentUserId !== motoUID) {
    alert("Bạn không có quyền thực hiện thao tác này!");
    return;
  }

  const handleEdit = () => {
    navigate(`/${motoUID}/edit/${motoID}`); // Điều hướng đến trang edit
  };

  const handleDelete = async () => {
    if (window.confirm("Bạn chắc chắn muốn xóa sản phẩm này?")) {
      try {
        // 1. Lấy dữ liệu sản phẩm để có danh sách hình ảnh
        const { data: motoData, error: fetchError } = await supabase
          .from("MOTORCYCLE")
          .select("image_url, uid")
          .eq("id", motoID)
          .single();

        if (fetchError) throw fetchError;

        // 2. Xóa các file hình ảnh khỏi Supabase Storage
        const imageUrls = motoData.image_url;
        if (imageUrls && imageUrls.length > 0) {
          const pathsToDelete = imageUrls.map((url) => {
            const parts = url.split("/");
            const fileName = parts[parts.length - 1];
            // Giả sử file được lưu trong folder có tên là uid
            return `${motoData.uid}/${fileName}`;
          });
          const { error: storageError } = await supabase.storage
            .from("motorcycle-media")
            .remove(pathsToDelete);
          if (storageError) throw storageError;
        }

        // 3. Xóa dữ liệu sản phẩm khỏi bảng MOTORCYCLE
        const { error } = await supabase
          .from("MOTORCYCLE")
          .delete()
          .eq("id", motoID)
          .eq("uid", motoUID);
        if (error) throw error;

        alert("Xóa thành công!");
        window.location.reload();
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Xóa thất bại!");
      }
    }
  };

  return (
    <div className="absolute right-0 bottom-0 m-3 p-5 flex flex-col gap-5 w-fit shadow-md bg-white rounded-[6px]">
      <button
        onClick={handleEdit}
        className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
      >
        <img src="icons/Edit.svg" alt="" /> Sửa
      </button>
      <button
        onClick={handleDelete}
        className="w-full text-[16px] text-left rounded-[6px] flex flex-row gap-1 p-2 hover:bg-[#efeeee] hover:shadow-md transition"
      >
        <img src="icons/Delete.svg" alt="" /> Xóa
      </button>
    </div>
  );
};

export default EditDeleteButton;
