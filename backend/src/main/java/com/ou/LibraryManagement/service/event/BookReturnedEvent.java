package com.ou.LibraryManagement.service.event;

import com.ou.LibraryManagement.entity.Borrow;

/**
 * Sự kiện phát ra khi Thủ thư xác nhận một cuốn sách đã được trả lại
 */
public record BookReturnedEvent(Borrow record) {
}