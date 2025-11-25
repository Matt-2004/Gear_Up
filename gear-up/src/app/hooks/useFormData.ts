interface IProfileFormData {
  NewEmail: string;
  Name: string;
  AvatarImage: string;
  DateOfBirth: string;
  PhoneNumber: string;
  CurrentPassword: string;
  NewPassword: string;
  ConfirmedNewPassword: string;
}

interface IKYCdata {
  DocumentType: string;
  Kyc: string[];
  SelifeImage: string; // BinaryString
}

type FromType = "profile" | "KYC";

function useFormData<T extends FromType>(
  formType: T,
  jsonData: Record<string, string | File | Blob>,
): FormData {
  const formData = new FormData();

  Object.keys(jsonData).forEach((key) => {
    const value = jsonData[key];

    // Handle different data types
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      // Handle arrays
      value.forEach((item, index) => {
        if (item instanceof File || item instanceof Blob) {
          formData.append(key, item);
        } else {
          formData.append(`${key}[${index}]`, JSON.stringify(item));
        }
      });
    } else if (value !== null && value !== undefined && value !== "") {
      // Convert other types to string
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : String(value),
      );
    }
  });

  return formData;
}

export default useFormData;
