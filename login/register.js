document.addEventListener('DOMContentLoaded', function () {
  const uploadBtn = document.getElementById("upload-btn");
  const uploadInput = document.getElementById("uploadImage");
  const modal = document.getElementById("cropperModal");
  const closeModal = document.getElementById("closeModal");
  const cropImage = document.getElementById("cropImage");
  const cropBtn = document.getElementById("crop-btn");
  const previewImage = document.getElementById("previewImage");
  const croppedInput = document.getElementById("croppedImageInput");
  const registerForm = document.getElementById("registerForm");
  let cropper;

  // Open file dialog
  uploadBtn.addEventListener("click", () => uploadInput.click());

  // Handle file input
  uploadInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, PNG or GIF images are allowed.");
      uploadInput.value = '';
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      alert("Image size should be less than 2MB");
      uploadInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
      cropImage.src = event.target.result;
      modal.style.display = "flex";

      if (cropper) cropper.destroy();

      cropper = new Cropper(cropImage, {
        aspectRatio: 1,
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        toggleDragModeOnDblclick: false,
      });
    };
    reader.readAsDataURL(file);
  });

  // Crop and preview image
  cropBtn.addEventListener("click", () => {
    if (!cropper) return;

    const canvas = cropper.getCroppedCanvas({
      width: 200,
      height: 200,
      fillColor: '#fff',
      imageSmoothingEnabled: true,
      imageSmoothingQuality: 'high',
    });

    const croppedData = canvas.toDataURL("image/jpeg", 0.9);
    const base64Size = Math.round((croppedData.length * 3) / 4); // approx decoded size

    if (base64Size > 11.8 * 1024 * 1024) {
      alert("Cropped image is too large. Try a smaller crop or image.");
      return;
    }

    previewImage.src = croppedData;
    croppedInput.value = croppedData;
    modal.style.display = "none";
    cropper.destroy();
    cropper = null;
  });

  // Close modal logic
  closeModal.addEventListener("click", closeCropper);
  window.addEventListener('click', (event) => {
    if (event.target === modal) closeCropper();
  });

  function closeCropper() {
    modal.style.display = "none";
    if (cropper) {
      cropper.destroy();
      cropper = null;
    }
    uploadInput.value = '';
    previewImage.src = "default.png";
    croppedInput.value = '';
  }

  // Register form submission
  if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData(registerForm);

    fetch("https://6a99726a09b8.ngrok-free.app/register", {
      method: "POST",
      body: formData
    })
    .then(async response => {
      if (!response.ok) {
        alert("❌ Server returned an error: " + response.status);
        throw new Error("Bad response");
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error("❌ Invalid JSON received from server");
        alert("❌ Server returned invalid response.");
        return;
      }

      // alert(result.message);

      if (result.status === "success") {
        const email = formData.get("email");
        localStorage.setItem("verify_email", email);
        window.location.href = "https://meixup.github.io/mu/login/verify_otp.html";
      }else {
        alert("⚠️ " + (result.message || "Registration failed"));
      }
    })
    .catch(err => {
      console.error("❌ Network or fetch error:", err);
      alert("❌ A network error occurred.");
    });
  });
}
});
