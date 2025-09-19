import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Radio,
  DatePicker,
  Checkbox,
} from "antd";

import moment from "moment";
import { toast } from "react-toastify";

import { useAddConventionMutation } from "../../../../redux/api/conventionApi";
import {
  useCreateOrderMutation,
  useVerifyPaymentMutation,
} from "../../../../redux/api/paymnetApi";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Group: CheckboxGroup } = Checkbox;

const yesNoOptions = [
  { label: "Yes", value: "1" },
  { label: "No", value: "0" },
];

const eventTimeOptions = [
  { label: "Day", value: "Day" },
  { label: "Night", value: "Night" },
  { label: "Full Day", value: "Full Day" },
];

const BookConventionSpace = ({
  openBookingModal,
  onClose,
  property_id,
  head_title,
}) => {
  const [form] = Form.useForm();
  const [addConvention, { isLoading }] = useAddConventionMutation();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const onFinish = async (values) => {
    try {
      // 🔹 Convert all form values into FormData
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (dayjs.isDayjs(value)) {
          // Convert to desired format
          formData.append(key, value.format("DD/MM/YYYY"));
        } else {
          formData.append(key, value);
        }
      });

      // add property_id explicitly
      if (property_id) {
        formData.append("property_id", property_id);
      }

      // Debug
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": ", pair[1]);
      }

      // 1️⃣ Create Razorpay order
      const order = await createOrder(formData).unwrap();
      console.log(order);

      if (!order?.order_id) {
        toast.error("Failed to create Razorpay order");
        return;
      }

      // 2️⃣ Razorpay checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency || "INR",
        name: "Rental Property",
        description: "Convention Hall Booking",
        order_id: order.order_id,
        handler: async function (response) {
          console.log(response);
          const verifyData = new FormData();
          verifyData.append(
            "razorpay_payment_id",
            response.razorpay_payment_id
          );
          verifyData.append("razorpay_order_id", response.razorpay_order_id);
          verifyData.append("razorpay_signature", response.razorpay_signature);

          try {
            const verifyRes = await verifyPayment(verifyData).unwrap();
            if (verifyRes.status) {
              toast.success("Payment verified & booking confirmed!");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Error verifying payment");
            console.error(err);
          }
        },
        prefill: {
          name: values.full_name,
          contact: values.mobail_number,
          email: "user@example.com",
        },
        theme: { color: "#7C0902" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      // reset form
      form.resetFields();
      onClose();
    } catch (error) {
      const errMsg =
        error?.data?.message ||
        error?.error ||
        "Failed to process payment. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <Modal
      title={`Book Now ${head_title}`}
      open={openBookingModal}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Book Now"
      okButtonProps={{
        style: {
          backgroundColor: "#7C0902",
          borderColor: "#7C0902",
          color: "white",
        },
        disabled: isLoading,
        loading: isLoading,
      }}
      cancelButtonProps={{
        style: { borderColor: "#7C0902", color: "#7C0902" },
      }}
      width="800px"
      style={{ maxHeight: "60vh", borderRadius: "8px" }}
    >
      <div className="px-1 ">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Full Name"
            name="full_name"
            rules={[{ required: true, message: "Please enter full name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Contact Mobile Number"
            name="mobail_number"
            rules={[{ required: true, message: "Please enter Contact Number" }]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter Number" />
          </Form.Item>

          <Form.Item
            label="Alternate Mobile Number"
            name="alt_number"
            rules={[
              { required: true, message: "Please enter Alternate Number" },
            ]}
          >
            <InputNumber style={{ width: "100%" }} placeholder="Enter Number" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <TextArea rows={2} placeholder="Enter address" />
          </Form.Item>

          <Form.Item label="Pin Code/Zip Code" name="pin_code">
            <Input placeholder="Enter Pin/Zip Code" />
          </Form.Item>

          <Form.Item label="Number Of Attendees" name="number_of_attendees">
            <InputNumber style={{ width: "100%" }} placeholder="Enter count" />
          </Form.Item>

          {/* Single Booking Date */}
          <Form.Item
            label="Booking Date"
            name="booking_date"
            rules={[{ required: true, message: "Please select booking date" }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            label="Event Time"
            name="event_time"
            rules={[{ required: true, message: "Please select event time" }]}
          >
            <Radio.Group options={eventTimeOptions} />
          </Form.Item>

          <Form.Item
            label="Amount"
            name="amount"
            rules={[{ required: true, message: "Please enter amount" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter amount"
            />
          </Form.Item>

          {/* {[
            { label: "Catering Needed", name: "catering_needed" },
            { label: "Chef Needed", name: "chef_needed" },
            { label: "Photographers Required", name: "photograper_needed" },
            { label: "Decoration Needed", name: "decore_needed" },
            { label: "Groceries Needed", name: "groceries_needed" },
          ].map(({ label, name }) => (
            <Form.Item key={name} label={label} name={name}>
              <Radio.Group options={yesNoOptions} />
            </Form.Item>
          ))} */}

          <Form.Item label="Comment (Optional)" name="comment">
            <TextArea rows={2} placeholder="Enter comment here..." />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default BookConventionSpace;
