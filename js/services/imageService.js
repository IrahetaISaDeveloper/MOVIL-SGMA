const API_BASE_URL = "https://sgma-66ec41075156.herokuapp.com/api";

export async function uploadImageToFolder(file, folder) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('folder', folder);

  const res = await fetch(`${API_BASE_URLS}/upload-to-folder`, {
    method: 'POST',
    body: formData,
    credentials: "include"
  });

  return res.json();
}