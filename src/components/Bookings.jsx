import React, { useState } from "react";
import {
  useGetBookingsQuery,
  useAcceptBookingsMutation,
  useRejectBookingsMutation,
} from "../redux/api/bookingsApi";
import {
  Table,
  Tag,
  Modal,
  Descriptions,
  Button,
  Space,
  Input,
  message,
} from "antd";

const { TextArea } = Input;

const Bookings = () => {
  const { data: Bookings, isFetching, refetch } = useGetBookingsQuery();
  const bookings = Bookings?.data?.data || [];

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("No reason provided");
  const [rejectId, setRejectId] = useState(null);

  const [acceptBooking, { isLoading: isAccepting }] =
    useAcceptBookingsMutation();
  const [rejectBooking, { isLoading: isRejecting }] =
    useRejectBookingsMutation();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  // Accept booking handler
  const handleAccept = async (id) => {
    try {
      await acceptBooking(id).unwrap();
      message.success("Booking accepted successfully");
      refetch();
    } catch (err) {
      console.error(err);
      message.error("Failed to accept booking");
    }
  };

  // Open reject modal
  const openRejectModal = (id) => {
    setRejectId(id);
    setRejectReason("No reason provided");
    setIsRejectModalOpen(true);
  };

  // Reject booking handler
  const handleRejectSubmit = async () => {
    try {
      // Create FormData for rejection reason
      const formdata = new FormData();
      formdata.append("reason", rejectReason || "No reason provided");

      await rejectBooking({ formdata, id: rejectId }).unwrap();

      message.success("Booking rejected");
      setIsRejectModalOpen(false);
      setRejectId(null);

      refetch();
    } catch (err) {
      console.error(err);
      message.error("Failed to reject booking");
    }
  };

  const columns = [
    {
      title: "Hall",
      dataIndex: ["convention_hall", "title"],
      key: "hall",
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: "Full Name",
      dataIndex: "full_name",
      key: "full_name",
    },
    {
      title: "Mobile",
      dataIndex: "mobail_number",
      key: "mobail_number",
    },
    {
      title: "Booking Date",
      dataIndex: "booking_date",
      key: "booking_date",
    },
    {
      title: "Event Time",
      dataIndex: "event_time",
      key: "event_time",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amt) => `₹${amt}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          color={
            status === "success"
              ? "green"
              : status === "pending"
              ? "orange"
              : "red"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedBooking(record)}>
            View Details
          </Button>
          <Button
            type="primary"
            danger
            loading={isRejecting && rejectId === record.id}
            onClick={() => openRejectModal(record.id)}
          >
            Reject
          </Button>
          <Button
            type="default"
            loading={isAccepting}
            onClick={() => handleAccept(record.id)}
          >
            Accept
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
          showSizeChanger: true,
        }}
        bordered
        scroll={{ x: "max-content" }}
        loading={isFetching}
      />

      {/* Booking Detail Modal */}
      <Modal
        title="Booking Details"
        open={!!selectedBooking}
        onCancel={() => setSelectedBooking(null)}
        footer={null}
        width={800}
      >
        {selectedBooking && (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Full Name">
              {selectedBooking.full_name}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {selectedBooking.mobail_number}
            </Descriptions.Item>
            <Descriptions.Item label="Alt Number">
              {selectedBooking.alt_number}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {selectedBooking.address}
            </Descriptions.Item>
            <Descriptions.Item label="Booking Date">
              {selectedBooking.booking_date}
            </Descriptions.Item>
            <Descriptions.Item label="Event Time">
              {selectedBooking.event_time}
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              ₹{selectedBooking.amount}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag
                color={
                  selectedBooking.status === "success"
                    ? "green"
                    : selectedBooking.status === "pending"
                    ? "orange"
                    : "red"
                }
              >
                {selectedBooking.status}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Catering Needed">
              {selectedBooking.catering_needed ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Chef Needed">
              {selectedBooking.chef_needed ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Photographer Needed">
              {selectedBooking.photograper_needed ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Decoration Needed">
              {selectedBooking.decore_needed ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Comment">
              {selectedBooking.comment}
            </Descriptions.Item>
            <Descriptions.Item label="Hall Name">
              {selectedBooking.convention_hall?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Hall Type">
              {selectedBooking.convention_hall?.hall_type}
            </Descriptions.Item>
            <Descriptions.Item label="Seating Capacity">
              {selectedBooking.convention_hall?.seating_capacity}
            </Descriptions.Item>
            <Descriptions.Item label="Hall Decorator">
              {selectedBooking.convention_hall?.hall_decorator_name} (
              {selectedBooking.convention_hall?.hall_decorator_number})
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Reject Reason Modal */}
      <Modal
        title="Reject Booking"
        open={isRejectModalOpen}
        onOk={handleRejectSubmit}
        onCancel={() => setIsRejectModalOpen(false)}
        confirmLoading={isRejecting}
        okText="Submit"
      >
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Enter rejection reason"
        />
      </Modal>
    </div>
  );
};

export default Bookings;
