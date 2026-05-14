import http from "node:http";

const PORT = 5555;

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve) => {
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url ?? "/", `http://localhost:${PORT}`);
  const method = req.method ?? "GET";

  // Health check for Playwright webServer readiness
  if (method === "GET" && url.pathname === "/health") {
    return json(res, 200, { status: "ok" });
  }

  // --- Auth: Login ---
  if (method === "POST" && url.pathname === "/api/v1/auth/login") {
    const body = await parseBody(req);
    const user = body.usernameOrEmail ?? "";

    if (user === "unverified@test.com") {
      return json(res, 403, {
        isSuccess: false,
        message: "Email not verified",
        data: null,
        status: 403,
      });
    }

    if (user === "wrong@test.com") {
      return json(res, 401, {
        isSuccess: false,
        message: "Invalid credentials",
        data: null,
        status: 401,
      });
    }

    return json(res, 200, {
      isSuccess: true,
      message: "Login successful",
      data: { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" },
      status: 200,
    });
  }

  // --- Auth: Register ---
  if (method === "POST" && url.pathname === "/api/v1/auth/register") {
    return json(res, 201, {
      isSuccess: true,
      message: "Registration successful, check your email for verification.",
      data: null,
      status: 201,
    });
  }

  // --- Auth: Send password reset token ---
  if (method === "POST" && url.pathname === "/api/v1/auth/send-password-reset-token") {
    return json(res, 200, {
      isSuccess: true,
      message: "Password reset link sent to your email.",
      data: null,
      status: 200,
    });
  }

  // --- Auth: Resend verification email ---
  if (method === "POST" && url.pathname === "/api/v1/auth/resend-verification-email") {
    return json(res, 200, {
      isSuccess: true,
      message: "Verification email sent.",
      data: null,
      status: 200,
    });
  }

  // --- Auth: Reset password ---
  if (method === "POST" && url.pathname === "/api/v1/auth/reset-password") {
    const token = url.searchParams.get("token") ?? "";

    if (token !== "valid-token") {
      return json(res, 400, {
        isSuccess: false,
        message: "Invalid or expired token.",
        data: null,
        status: 400,
      });
    }

    return json(res, 200, {
      isSuccess: true,
      message: "Password has been reset successfully.",
      data: null,
      status: 200,
    });
  }

  // --- Cars: build mock car items ---
  const mockCars = Array.from({ length: 6 }, (_, i) => ({
    id: `car-${i + 1}`,
    thumbnailUrl: `https://picsum.photos/seed/car${i + 1}/640/360`,
    title: `Mock Car ${i + 1} - Great Condition`,
    make: ["Toyota", "Honda", "BMW", "Tesla", "Ford", "Mazda"][i],
    model: ["Camry", "Civic", "X5", "Model 3", "Mustang", "CX-5"][i],
    transmissionType: i % 2 === 0 ? "Automatic" : "Manual",
    carValidationStatus: i < 3 ? "Approved" : "Pending",
    mileage: 10000 + i * 15000,
    seatingCapacity: 4 + (i % 2) * 2,
    price: 500000 + i * 200000,
    color: ["Black", "White", "Silver", "Blue", "Red", "Gray"][i],
    createdAt: new Date().toISOString(),
  }));

  const mockCarDetail = (id) => ({
    name: `Dealer for ${id}`,
    dealerId: "dealer-1",
    id,
    title: `Mock Car Detail - ${id}`,
    description: "This is a detailed description of the mock car. Well maintained and in excellent condition.",
    model: "Camry",
    make: "Toyota",
    year: 2023,
    price: 850000,
    color: "Black",
    mileage: 15000,
    seatingCapacity: 5,
    engineCapacity: 2.5,
    carImages: [
      { id: "img-1", carId: id, url: "https://picsum.photos/seed/detail1/800/450" },
      { id: "img-2", carId: id, url: "https://picsum.photos/seed/detail2/800/450" },
      { id: "img-3", carId: id, url: "https://picsum.photos/seed/detail3/800/450" },
    ],
    fuelType: "Petrol",
    carCondition: "Used",
    transmissionType: "Automatic",
    carStatus: "Approved",
    carValidationStatus: "Approved",
    vin: "1HGBH41JXMN109186",
    licensePlate: "ABC-1234",
  });

  // --- Cars: List (landing page) ---
  if (method === "GET" && url.pathname === "/api/v1/cars") {
    const cursor = url.searchParams.get("cursor") ?? "";
    const page = cursor ? 1 : 0;
    const pageSize = 3;
    const start = page * pageSize;
    const items = mockCars.slice(start, start + pageSize);
    const hasMore = start + pageSize < mockCars.length;
    return json(res, 200, {
      isSuccess: true,
      message: "Cars retrieved",
      data: {
        items,
        nextCursor: hasMore ? `cursor-page-${page + 1}` : null,
        hasMore,
      },
      status: 200,
    });
  }

  // --- Cars: Search ---
  if (method === "GET" && url.pathname === "/api/v1/cars/search") {
    const query = (url.searchParams.get("query") ?? "").toLowerCase();
    const cursor = url.searchParams.get("cursor") ?? "";
    // Return no results for empty query (error simulation)
    if (query === "error") {
      return json(res, 500, {
        isSuccess: false,
        message: "Search service unavailable",
        data: null,
        status: 500,
      });
    }
    const filtered = mockCars.filter(
      (c) =>
        c.make.toLowerCase().includes(query) ||
        c.model.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query),
    );
    // "nothing" query returns empty results
    if (query === "nothing") {
      return json(res, 200, {
        isSuccess: true,
        message: "No matching cars",
        data: { items: [], nextCursor: null, hasMore: false },
        status: 200,
      });
    }
    const page = cursor ? 1 : 0;
    const pageSize = 4;
    const start = page * pageSize;
    const items = filtered.slice(start, start + pageSize);
    const hasMore = start + pageSize < filtered.length;
    return json(res, 200, {
      isSuccess: true,
      message: "Search results",
      data: {
        items,
        nextCursor: hasMore ? `cursor-page-${page + 1}` : null,
        hasMore,
      },
      status: 200,
    });
  }

  // --- Cars: Dealer inventory (my-car) — must be BEFORE the generic /cars/{id} regex ---
  if (method === "GET" && url.pathname === "/api/v1/cars/my-car") {
    const status = url.searchParams.get("status") ?? "Approved";
    const filtered = mockCars.filter((c) => c.carValidationStatus === status);
    return json(res, 200, {
      isSuccess: true,
      message: "Dealer cars retrieved",
      data: { items: filtered, nextCursor: null, hasMore: false },
      status: 200,
    });
  }

  // --- Cars: Detail (GET /api/v1/cars/{id}) ---
  if (method === "GET") {
    const carDetailMatch = url.pathname.match(/^\/api\/v1\/cars\/([^/]+)$/);
    if (carDetailMatch) {
      const carId = carDetailMatch[1];
      return json(res, 200, {
        isSuccess: true,
        message: "Car detail retrieved",
        data: mockCarDetail(carId),
        status: 200,
      });
    }
  }

  // --- Appointments: Create ---
  if (method === "POST" && url.pathname === "/api/v1/appointments") {
    return json(res, 201, {
      isSuccess: true,
      message: "Appointment scheduled successfully. The dealer will confirm shortly.",
      data: null,
      status: 201,
    });
  }

  // --- Cars: Add (POST /api/v1/cars) ---
  if (method === "POST" && url.pathname === "/api/v1/cars") {
    return json(res, 201, {
      isSuccess: true,
      message: "Car added successfully.",
      data: null,
      status: 201,
    });
  }

  // --- Cars: Update (PUT /api/v1/cars/{id}) ---
  if (method === "PUT") {
    const updateMatch = url.pathname.match(/^\/api\/v1\/cars\/([^/]+)$/);
    if (updateMatch) {
      return json(res, 200, {
        isSuccess: true,
        message: "Car updated successfully.",
        data: null,
        status: 200,
      });
    }
  }

  // --- Cars: Delete (DELETE /api/v1/cars/{id}) ---
  if (method === "DELETE") {
    const deleteMatch = url.pathname.match(/^\/api\/v1\/cars\/([^/]+)$/);
    if (deleteMatch) {
      return json(res, 200, {
        isSuccess: true,
        message: "Car deleted successfully.",
        data: null,
        status: 200,
      });
    }
  }

  // --- User profile: GET /api/v1/users/me ---
  if (method === "GET" && url.pathname === "/api/v1/users/me") {
    return json(res, 200, {
      isSuccess: true,
      message: "User profile retrieved",
      data: {
        id: "user-1",
        name: "Test User",
        email: "success@test.com",
        phoneNumber: "0812345678",
        dateOfBirth: "1990-01-15",
        avatarUrl: null,
        role: "User",
      },
      status: 200,
    });
  }

  // --- User profile: GET /api/v1/users/{id} (public dealer profile) ---
  if (method === "GET") {
    const userIdMatch = url.pathname.match(/^\/api\/v1\/users\/([^/]+)$/);
    if (userIdMatch && userIdMatch[1] !== "me") {
      return json(res, 200, {
        isSuccess: true,
        message: "User profile retrieved",
        data: {
          id: userIdMatch[1],
          name: "Dealer " + userIdMatch[1],
          email: "dealer@test.com",
          phoneNumber: "0812345678",
          dateOfBirth: "1990-01-15",
          avatarUrl: null,
          role: "Dealer",
        },
        status: 200,
      });
    }
  }

  // --- User cars: GET /api/v1/users/{id}/cars ---
  if (method === "GET") {
    const userCarsMatch = url.pathname.match(/^\/api\/v1\/users\/([^/]+)\/cars$/);
    if (userCarsMatch) {
      const approvedCars = mockCars.filter((c) => c.carValidationStatus === "Approved");
      return json(res, 200, {
        isSuccess: true,
        message: "User cars retrieved",
        data: { items: approvedCars, nextCursor: null, hasMore: false },
        status: 200,
      });
    }
  }

  // --- Admin: Cars list ---
  if (method === "GET" && url.pathname === "/api/v1/admin/cars") {
    return json(res, 200, {
      isSuccess: true,
      message: "Admin cars retrieved",
      data: {
        items: mockCars.map((c) => ({
          ...c,
          dealerId: "dealer-1",
          dealerName: "Test Dealer",
        })),
        totalCount: mockCars.length,
      },
      status: 200,
    });
  }

  // --- Admin: KYC list ---
  if (method === "GET" && url.pathname === "/api/v1/admin/kyc") {
    return json(res, 200, {
      isSuccess: true,
      message: "KYC list retrieved",
      data: {
        items: [
          {
            kycId: "kyc-1",
            userId: "user-1",
            name: "Test User",
            email: "user@test.com",
            phone: "0812345678",
            dateOfBirth: "1990-01-15",
            status: "Pending",
            documentType: "Passport",
            documentUrls: ["https://picsum.photos/seed/doc1/400/300"],
            selfieUrl: "https://picsum.photos/seed/selfie1/400/300",
            submittedAt: new Date().toISOString(),
            rejectionReason: null,
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
      status: 200,
    });
  }

  // --- Admin: KYC detail ---
  if (method === "GET") {
    const kycMatch = url.pathname.match(/^\/api\/v1\/admin\/kyc\/([^/]+)$/);
    if (kycMatch) {
      return json(res, 200, {
        isSuccess: true,
        message: "KYC detail retrieved",
        data: {
          kycId: kycMatch[1],
          userId: "user-1",
          name: "Test User",
          email: "user@test.com",
          phone: "0812345678",
          dateOfBirth: "1990-01-15",
          status: "Pending",
          documentType: "Passport",
          documentUrls: ["https://picsum.photos/seed/doc1/400/300", "https://picsum.photos/seed/doc2/400/300"],
          selfieUrl: "https://picsum.photos/seed/selfie1/400/300",
          submittedAt: new Date().toISOString(),
          rejectionReason: null,
        },
        status: 200,
      });
    }
  }

  // --- Admin: Update car/KYC status (PUT) ---
  if (method === "PUT" && (url.pathname.startsWith("/api/v1/admin/cars/") || url.pathname.startsWith("/api/v1/admin/kyc/"))) {
    return json(res, 200, {
      isSuccess: true,
      message: "Status updated successfully.",
      data: null,
      status: 200,
    });
  }

  // --- KYC Register (POST /api/v1/users/kyc) ---
  if (method === "POST" && url.pathname === "/api/v1/users/kyc") {
    return json(res, 200, {
      isSuccess: true,
      message: "KYC submitted successfully.",
      data: null,
      status: 200,
    });
  }

  // --- Messages: Conversations ---
  if (method === "GET" && url.pathname === "/api/v1/messages/conversations") {
    return json(res, 200, {
      isSuccess: true,
      message: "Conversations retrieved",
      data: {
        items: [
          {
            id: "conv-1",
            otherUserId: "user-2",
            otherUserName: "Jane Dealer",
            otherUserAvatar: null,
            lastMessage: { text: "Is the car still available?", sentAt: new Date().toISOString(), senderId: "user-1" },
            unreadCount: 0,
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
      status: 200,
    });
  }

  // --- Posts: List ---
  if (method === "GET" && url.pathname === "/api/v1/posts") {
    return json(res, 200, {
      isSuccess: true,
      message: "Posts retrieved",
      data: {
        items: [
          {
            id: "post-1",
            caption: "Check out this amazing car!",
            content: "Great condition, low mileage.",
            visibility: "Public",
            carId: "car-1",
            authorUsername: "Test User",
            authorAvatarUrl: "https://i.pravatar.cc/40?u=test",
            likeCount: 5,
            commentCount: 2,
            isLikedByCurrentUser: false,
            viewCount: 120,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            carDto: mockCarDetail("car-1"),
          },
        ],
        nextCursor: null,
        hasMore: false,
      },
      status: 200,
    });
  }

  // --- Posts: Create ---
  if (method === "POST" && url.pathname === "/api/v1/posts") {
    return json(res, 201, {
      isSuccess: true,
      message: "Post created successfully.",
      data: { id: "post-new" },
      status: 201,
    });
  }

  // --- Comments: List ---
  if (method === "GET") {
    const commentsMatch = url.pathname.match(/^\/api\/comments\/([^/]+)\/(top|children)$/);
    if (commentsMatch) {
      return json(res, 200, {
        isSuccess: true,
        message: "Comments retrieved",
        data: {
          items: [
            {
              id: "comment-1",
              text: "Great car!",
              author: { id: "user-2", name: "Commenter", avatar: null },
              likeCount: 0,
              isLiked: false,
              createdAt: new Date().toISOString(),
              replyCount: 0,
            },
          ],
        },
        status: 200,
      });
    }
  }

  // --- Comments: Create ---
  if (method === "POST" && url.pathname === "/api/comments") {
    return json(res, 201, {
      isSuccess: true,
      message: "Comment added.",
      data: null,
      status: 201,
    });
  }

  // --- Posts: Like ---
  if (method === "POST") {
    const likeMatch = url.pathname.match(/^\/api\/v1\/posts\/([^/]+)\/like$/);
    if (likeMatch) {
      return json(res, 200, {
        isSuccess: true,
        message: "Post liked.",
        data: null,
        status: 200,
      });
    }
  }

  // Fallback: return empty success for GETs so pages don't crash;
  // return a generic error for unhandled mutating requests.
  if (method === "GET") {
    return json(res, 200, {
      isSuccess: true,
      message: "OK (mock)",
      data: { items: [], nextCursor: null, hasMore: false },
      status: 200,
    });
  }

  console.warn(`[mock-server] Unhandled: ${method} ${url.pathname}`);
  json(res, 500, {
    isSuccess: false,
    message: `Unhandled route: ${method} ${url.pathname}`,
    data: null,
    status: 500,
  });
});

server.listen(PORT, () => {
  console.log(`[mock-server] Running on http://localhost:${PORT}`);
});
