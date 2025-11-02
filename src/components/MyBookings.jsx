import React, { useState } from "react";
import {
  useGetMyBookingsQuery,
  useUpdateMyBookingsMutation,
} from "../redux/api/bookingsApi";
import {
  Table,
  Typography,
  Spin,
  Tag,
  Modal,
  Descriptions,
  Button,
  Space,
  Form,
  Checkbox,
  Radio,
} from "antd";
import { EyeOutlined, EditOutlined } from "@ant-design/icons";

const { Title } = Typography;

const MyBookings = () => {
  const {
    data: myBookings,
    isLoading,

    isFetching,
  } = useGetMyBookingsQuery();
  const bookings = myBookings?.data?.data || [];
  const [updateMyBookings, { isLoading: isUpdating, error }] =
    useUpdateMyBookingsMutation();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateForm] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  //   if (isLoading) return <Spin fullscreen />;
  //   if (error) return <p>Something went wrong...</p>;

  const openUpdateModal = (booking) => {
    setCurrentBooking(booking);
    setIsUpdateModalOpen(true);
    updateForm.setFieldsValue({
      groceries_needed: booking.groceries_needed ? "1" : "0",
      decore_needed: booking.decore_needed ? "1" : "0",
      photograper_needed: booking.photograper_needed ? "1" : "0",
      chef_needed: booking.chef_needed ? "1" : "0",
      catering_needed: booking.catering_needed ? "1" : "0",
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      const values = await updateForm.validateFields();
      const formData = new FormData();

      // formData.append("id", currentBooking.id);
      formData.append("groceries_needed", values.groceries_needed);
      formData.append("decore_needed", values.decore_needed);
      formData.append("photograper_needed", values.photograper_needed);
      formData.append("chef_needed", values.chef_needed);
      formData.append("catering_needed", values.catering_needed);

      await updateMyBookings({
        formdata: formData,
        id: currentBooking.id,
      }).unwrap();

      setIsUpdateModalOpen(false);
      setCurrentBooking(null);
      refetch();
    } catch (error) {
      console.error("Update failed:", error);
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
      dataIndex: "order_status",
      key: "order_status",
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
          <Button
            type="link"
            onClick={() => setSelectedBooking(record)}
            icon={<EyeOutlined />}
          >
            View
          </Button>
          <Button
            type="link"
            onClick={() => openUpdateModal(record)}
            icon={<EditOutlined />}
          >
            Update
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="">
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

      {/* Updaitng details modal */}
      <Modal
        title="Update Booking"
        open={isUpdateModalOpen}
        onCancel={() => setIsUpdateModalOpen(false)}
        onOk={handleUpdateSubmit}
        okText="Update"
        confirmLoading={isUpdating} // if you have a loading flag from mutation
        width={600}
      >
        {currentBooking && (
          <Form layout="vertical" form={updateForm}>
            <Form.Item
              name="groceries_needed"
              label="Groceries Needed"
              initialValue={currentBooking.groceries_needed ? "1" : "0"}
            >
              <Radio.Group>
                <Radio value="1">Yes</Radio>
                <Radio value="0">No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="decore_needed"
              label="Decoration Needed"
              initialValue={currentBooking.decore_needed ? "1" : "0"}
            >
              <Radio.Group>
                <Radio value="1">Yes</Radio>
                <Radio value="0">No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="photograper_needed"
              label="Photographer Needed"
              initialValue={currentBooking.photograper_needed ? "1" : "0"}
            >
              <Radio.Group>
                <Radio value="1">Yes</Radio>
                <Radio value="0">No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="chef_needed"
              label="Chef Needed"
              initialValue={currentBooking.chef_needed ? "1" : "0"}
            >
              <Radio.Group>
                <Radio value="1">Yes</Radio>
                <Radio value="0">No</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              name="catering_needed"
              label="Catering Needed"
              initialValue={currentBooking.catering_needed ? "1" : "0"}
            >
              <Radio.Group>
                <Radio value="1">Yes</Radio>
                <Radio value="0">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        )}
      </Modal>

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
            <Descriptions.Item label="Groceries Needed">
              {selectedBooking.groceries_needed ? "Yes" : "No"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default MyBookings;
