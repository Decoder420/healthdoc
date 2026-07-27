export const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case "VERIFIED":
      return "success";

    case "READY":
      return "primary";

    case "PROCESSING":
      return "warning";

    case "COLLECTED":
      return "secondary";

    case "QUEUE":
      return "info";

    case "REJECTED":
      return "error";

    default:
      return "default";
  }
};