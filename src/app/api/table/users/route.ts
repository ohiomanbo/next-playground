import { NextRequest, NextResponse } from "next/server";

export interface User {
  idx: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: "male" | "female";
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  count: number;
  isNext: boolean;
}

// 더미 데이터를 생성하는 함수
function generateDummyUsers(count: number) {
  const firstNames = ["John", "Jane", "Joe", "Sarah", "Mike", "Emily", "Chris", "Anna", "David", "Laura"];
  const lastNames = ["Doe", "Smith", "Johnson", "Brown", "Davis", "Wilson", "Taylor", "Anderson", "Thomas", "Miller"];
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const idx = i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 50) + 18; // 18 ~ 67 사이의 나이
    const gender = Math.random() < 0.5 ? "male" : "female"; // 성별을 랜덤으로 지정
    users.push({ idx, firstName, lastName, age, gender });
  }

  return users;
}

// 100명의 더미 데이터 생성
const users = generateDummyUsers(100);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "5", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);
  const sort = searchParams.get("sort") || "";

  let sortedUsers = [...users];

  // 정렬 처리
  if (sort) {
    const [key, order] = sort.split(":") as [keyof (typeof users)[0], string]; // keyof typeof users[0]을 사용하여 타입 안전성 확보
    sortedUsers.sort((a, b) => {
      if (a[key] < b[key]) return order === "desc" ? 1 : -1;
      if (a[key] > b[key]) return order === "desc" ? -1 : 1;
      return 0;
    });
  }

  // 페이징 처리
  const paginatedUsers = sortedUsers.slice(offset, offset + limit);
  const totalCount = sortedUsers.length;

  // 1초 지연을 추가하여 실제 API 호출을 시뮬레이션합니다
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return NextResponse.json({
    count: paginatedUsers.length,
    totalCount: totalCount,
    data: paginatedUsers,
    isNext: offset + limit < totalCount,
  } as PaginatedResponse<User>);
}
