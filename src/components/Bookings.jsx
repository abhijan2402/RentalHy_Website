import React, { useState } from "react";
import { useGetBookingsQuery } from "../redux/api/bookingsApi";
import {
  Table,
  Typography,
  Spin,
  Tag,
  Modal,
  Descriptions,
  Button,
  Space,
} from "antd";

const { Title } = Typography;

const Bookings = () => {
  const { data: Bookings, isLoading, error } = useGetBookingsQuery();
  console.log(Bookings)
  const bookings = Bookings?.data?.data || [];

  const [selectedBooking, setSelectedBooking] = useState(null);

  //   if (isLoading) return <Spin fullscreen />;
  //   if (error) return <p>Something went wrong...</p>;

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
        </Space>
      ),
    },
  ];

  return (
    <div className="">
      {/* <Title level={3} style={{ textAlign: "center", marginBottom: 20 }}>
        My Bookings
      </Title> */}

      <Table
        columns={columns}
        dataSource={bookings}
        rowKey="id"
        pagination={{ pageSize: 5 }}
        bordered
        scroll={{ x: "max-content" }} // 👈 enables horizontal scroll
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
    </div>
  );
};

export default Bookings;
