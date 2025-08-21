export async function registerController(request, response) {
  const user = await registerUser(request.body);

  response.json({
    status: 201,
    message: "User registered successfully",
    data: user,
  });
}
export async function loginController(request, response) {}
export async function refreshUserSessionController(request, response) {}
export async function logoutController(request, response) {}
