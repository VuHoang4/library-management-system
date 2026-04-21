// map BorrowRecord → UI model
export const mapBorrowToCard = (b) => ({
  id: b.id,
  title: b.bookTitle,
  imageUrl: b.imageUrl,
  startDate: b.borrowDate,
  endDate: b.dueDate,
  returnDate: b.returnDate,
  status: b.status,
  type: "borrow",
  renewCount: b.renewCount || 0,
});

// map Reservation → UI model
export const mapReservationToCard = (r) => ({
  id: r.id,
  title: r.bookTitle,
  imageUrl: r.imageUrl,
  startDate: r.reservationDate,
  endDate: r.expireDate,
  returnDate: null,
  status: r.status,
  type: "reservation",
});