export default function getServerResponse(data: any) {
  // Mock server response logic
  console.log(data);
  return { success: true, receivedData: data };
}
