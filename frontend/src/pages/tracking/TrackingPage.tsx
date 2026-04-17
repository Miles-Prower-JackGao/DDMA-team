import { useEffect, useRef, useState } from "react";
import { Alert, Badge, Button, Card, QRCode, Spin, Typography } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CarOutlined,
  CheckCircleOutlined,
  InboxOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getTracking, type TrackingState } from "../../api/client";

const { Title, Text } = Typography;

const STEPS = [
  { icon: <CalendarOutlined />, label: "Scheduled" },
  { icon: <CarOutlined />, label: "Heading To Pickup" },
  { icon: <InboxOutlined />, label: "Pickup In Progress" },
  { icon: <RocketOutlined />, label: "In Transit" },
  { icon: <CheckCircleOutlined />, label: "Delivered" },
];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

function getStepIndex(status: string): number {
  switch (status) {
    case "PENDING":
      return 0;
    case "IN_TRANSIT":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return 0;
  }
}

export function TrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [tracking, setTracking] = useState<TrackingState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchTracking = async () => {
      if (!orderId) {
        setError("Tracking order id is missing.");
        setLoading(false);
        return;
      }

      try {
        const data = await getTracking(orderId);
        setTracking(data);
        setError(null);
        if (data.status === "DELIVERED" && intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } catch (fetchError) {
        setError(
          fetchError instanceof Error
            ? fetchError.message
            : "Unable to load tracking right now.",
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchTracking();
    intervalRef.current = setInterval(() => {
      void fetchTracking();
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [orderId]);

  const currentStep = tracking ? getStepIndex(tracking.status) : 0;
  const isDelivered = tracking?.status === "DELIVERED";
  const pin = tracking?.handoff_pin ?? sessionStorage.getItem("handoffPin") ?? "----";

  const vehiclePosition =
    tracking != null
      ? {
          lat: Number(tracking.sim_lat),
          lng: Number(tracking.sim_lng),
        }
      : null;

  const mapCenter = vehiclePosition ?? { lat: 37.7749, lng: -122.4194 };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 80 }}>
        <Spin size="large" tip="Loading tracking..." />
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/history")}
          style={{ color: "#6B7280", padding: 0, marginBottom: 12 }}
        >
          Back To History
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Title level={2} style={{ margin: 0, color: "#1A1D2E", letterSpacing: -0.5 }}>
            Live Tracking
          </Title>
          <Badge
            status={isDelivered ? "success" : "processing"}
            text={
              <Text
                style={{
                  fontSize: 13,
                  color: isDelivered ? "#10B981" : "#4F6EF7",
                  fontWeight: 600,
                }}
              >
                {isDelivered ? "Delivered" : "In Transit"}
              </Text>
            }
          />
        </div>
        <Text type="secondary" style={{ fontSize: 13 }}>
          Order {orderId}
        </Text>
      </div>

      {error ? (
        <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />
      ) : null}

      <div
        style={{
          borderRadius: 16,
          overflow: "hidden",
          height: 300,
          marginBottom: 24,
        }}
      >
        {GOOGLE_MAPS_API_KEY ? (
          <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
            <Map
              defaultCenter={mapCenter}
              center={vehiclePosition ?? mapCenter}
              defaultZoom={15}
              zoom={15}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              {vehiclePosition ? (
                <Marker
                  position={vehiclePosition}
                  title={tracking?.vehicle_type === "DRONE" ? "Drone" : "Robot"}
                />
              ) : null}
            </Map>
          </APIProvider>
        ) : (
          <div
            style={{
              alignItems: "center",
              background: "linear-gradient(135deg, #E8F1FF 0%, #F7F9FF 100%)",
              color: "#1A1D2E",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              padding: 24,
              textAlign: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>
                Google Maps API key is missing
              </div>
              <div>
                {vehiclePosition
                  ? `Vehicle at ${vehiclePosition.lat.toFixed(5)}, ${vehiclePosition.lng.toFixed(5)}`
                  : "Tracking coordinates are not available yet."}
              </div>
            </div>
          </div>
        )}
      </div>

      {isDelivered ? (
        <Alert
          message="Delivery complete. The parcel has arrived."
          type="success"
          showIcon
          style={{ marginBottom: 20, borderRadius: 12 }}
        />
      ) : null}

      <Card style={{ marginBottom: 20, borderRadius: 14 }} styles={{ body: { padding: "24px 28px" } }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.8,
            color: "#9CA3AF",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Order Progress
        </div>
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          {STEPS.map((step, index) => {
            const isDone = index < currentStep;
            const isActive = index === currentStep;
            return (
              <div
                key={step.label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                {index < STEPS.length - 1 ? (
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      left: "50%",
                      right: "-50%",
                      height: 2,
                      background: isDone ? "#4F6EF7" : "#E5EAFF",
                      zIndex: 0,
                    }}
                  />
                ) : null}
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    zIndex: 1,
                    background: isDone ? "#4F6EF7" : isActive ? "#EEF2FF" : "#F4F6FD",
                    border: `2px solid ${isDone ? "#4F6EF7" : isActive ? "#4F6EF7" : "#E5EAFF"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: isDone ? "#fff" : isActive ? "#4F6EF7" : "#C4CCDD",
                    fontSize: 14,
                    boxShadow: isActive ? "0 0 0 4px rgba(79,110,247,0.15)" : "none",
                  }}
                >
                  {step.icon}
                </div>
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 8,
                    textAlign: "center",
                    color: isDone ? "#4F6EF7" : isActive ? "#1A1D2E" : "#C4CCDD",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {step.label}
                </Text>
              </div>
            );
          })}
        </div>
      </Card>

      {!isDelivered && tracking ? (
        <Card style={{ marginBottom: 20, borderRadius: 14 }} styles={{ body: { padding: "16px 28px" } }}>
          <Text type="secondary">Estimated Arrival:</Text>
          <Text strong style={{ fontSize: 20, color: "#4F6EF7", marginLeft: 8 }}>
            ~{tracking.eta_minutes} min
          </Text>
        </Card>
      ) : null}

      <Card style={{ borderRadius: 14 }} styles={{ body: { padding: "24px 28px" } }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.8,
            color: "#9CA3AF",
            textTransform: "uppercase",
            marginBottom: 20,
          }}
        >
          Unlock Verification
        </div>
        <div
          style={{
            display: "flex",
            gap: 32,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
              Pickup PIN
            </Text>
            <div
              style={{
                background: "#EEF2FF",
                borderRadius: 12,
                padding: "12px 20px",
                display: "inline-block",
                fontFamily: '"SF Mono", "Fira Code", "Courier New", monospace',
                fontSize: 36,
                fontWeight: 800,
                letterSpacing: 10,
                color: "#4F6EF7",
              }}
            >
              {pin}
            </div>
            <Text type="secondary" style={{ fontSize: 12, display: "block", marginTop: 8 }}>
              Use this PIN to unlock the parcel compartment.
            </Text>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 13, display: "block", marginBottom: 8 }}>
              QR Unlock
            </Text>
            <div
              style={{
                border: "2px solid #E5EAFF",
                borderRadius: 12,
                padding: 8,
                display: "inline-block",
              }}
            >
              <QRCode value={`UNLOCK:${orderId}:${pin}`} size={100} bordered={false} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
