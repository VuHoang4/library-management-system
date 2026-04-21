// src/utils/mockData.js

export const MOCK_STATS = {
  totalBooks: 1250,
  activeBorrows: 45,
  overdueBorrows: 12,
  totalReaders: 320,
};

export const MOCK_RECENT_BORROWS = [
  { id: "BR001", readerName: "Nguyễn Văn A", bookTitle: "Clean Code", status: "QUEUE", date: "2026-04-18" },
  { id: "BR002", readerName: "Trần Thị B", bookTitle: "Atomic Habits", status: "HOLDING", date: "2026-04-17" },
  { id: "BR003", readerName: "Lê Văn C", bookTitle: "Sapiens", status: "BORROWED", date: "2026-04-10" },
  { id: "BR004", readerName: "Phạm Thị D", bookTitle: "Deep Work", status: "OVERDUE", date: "2026-03-25" },
];

export const MOCK_BOOKS = [
  { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Công nghệ", quantity: 5, available: 2 },
  { id: 2, title: "Atomic Habits", author: "James Clear", category: "Kỹ năng", quantity: 10, available: 10 },
  { id: 3, title: "Sapiens", author: "Yuval Noah Harari", category: "Lịch sử", quantity: 8, available: 0 },
];