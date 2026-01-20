 "use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./page.module.css";

export default function Home() {
  type Center = {
    id: string;
    name: string;
    city: string;
    phone: string;
    email: string;
    status: string;
    address?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    description?: string;
  };

  type Behavior = {
    serial_number: number;
    behavior: string;
    start_timestamp: number;
    end_timestamp: number;
    severity: string;
    notes: string;
    source: string;
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(false);
  const [role, setRole] = useState<"admin" | "therapy" | "therapist" | null>(
    null
  );
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(120);
  const [timelineZoom, setTimelineZoom] = useState(34);
  const [isBehaviorModalOpen, setIsBehaviorModalOpen] = useState(false);
  const [behaviorModalMode, setBehaviorModalMode] = useState<"add" | "edit">(
    "add"
  );
  const [editingSerial, setEditingSerial] = useState<number | null>(null);
  const [behaviorForm, setBehaviorForm] = useState({
    timestamp: "00:00",
    category: "",
    severity: "Moderate",
    notes: "",
  });
  const [sessionBehaviorMap, setSessionBehaviorMap] = useState<
    Record<string, Behavior[]>
  >(() => ({
    "0": [
      {
        serial_number: 1,
        behavior: "non-compliance",
        start_timestamp: 6,
        end_timestamp: 9,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 2,
        behavior: "hair pulling",
        start_timestamp: 7,
        end_timestamp: 8,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 3,
        behavior: "throwing",
        start_timestamp: 14,
        end_timestamp: 18,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 4,
        behavior: "whimpering",
        start_timestamp: 20,
        end_timestamp: 21,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 5,
        behavior: "throwing",
        start_timestamp: 28,
        end_timestamp: 29,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 6,
        behavior: "non-compliance",
        start_timestamp: 30,
        end_timestamp: 40,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 7,
        behavior: "hair pulling",
        start_timestamp: 36,
        end_timestamp: 38,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 8,
        behavior: "throwing",
        start_timestamp: 39,
        end_timestamp: 42,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 9,
        behavior: "hitting",
        start_timestamp: 45,
        end_timestamp: 46,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 10,
        behavior: "throwing",
        start_timestamp: 52,
        end_timestamp: 55,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 11,
        behavior: "hitting",
        start_timestamp: 61,
        end_timestamp: 62,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 12,
        behavior: "hair pulling",
        start_timestamp: 72,
        end_timestamp: 74,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 13,
        behavior: "throwing",
        start_timestamp: 91,
        end_timestamp: 94,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 14,
        behavior: "hair pulling",
        start_timestamp: 116,
        end_timestamp: 120,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
    ],
    "1": [
      {
        serial_number: 1,
        behavior: "out of seat",
        start_timestamp: 26,
        end_timestamp: 38,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 2,
        behavior: "screaming",
        start_timestamp: 56,
        end_timestamp: 58,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 3,
        behavior: "non-compliance",
        start_timestamp: 68,
        end_timestamp: 70,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 4,
        behavior: "out of seat",
        start_timestamp: 81,
        end_timestamp: 105,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 5,
        behavior: "screaming",
        start_timestamp: 87,
        end_timestamp: 88,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
      {
        serial_number: 6,
        behavior: "whimpering",
        start_timestamp: 116,
        end_timestamp: 117,
        severity: "Moderate",
        notes: "",
        source: "AI",
      },
    ],
  }));
  const [therapyView, setTherapyView] = useState<"list" | "add">("list");
  const [therapistForm, setTherapistForm] = useState({
    role: "",
    name: "",
    phone: "",
    email: "",
  });
  const [therapists, setTherapists] = useState<
    { id: string; name: string; email: string; role: string; status: string }[]
  >([]);
  const [childView, setChildView] = useState<"list" | "add">("list");
  const [scheduleChildId, setScheduleChildId] = useState<string | null>(null);
  const [scheduleForm, setScheduleForm] = useState({
    date: "",
    time: "",
    meridiem: "AM",
    duration: "",
    rbtId: "",
    bcbaNotes: "",
  });
  const [childForm, setChildForm] = useState({
    name: "",
    dob: "",
    diagnosis: "",
    parentContact: "",
    therapistId: "",
    icdCode: "",
    insurance: "",
    intakeNotes: "",
    photoName: "",
  });
  const [children, setChildren] = useState<
    {
      id: string;
      name: string;
      diagnosis: string;
      therapistId: string;
      status: string;
      age: string;
    }[]
  >([]);
  const [showChildToast, setShowChildToast] = useState(false);
  const [showScheduleToast, setShowScheduleToast] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [view, setView] = useState<"centers" | "add">("centers");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    phone: "",
    email: "",
    description: "",
  });
  const [centers, setCenters] = useState<Center[]>(() => [
    {
      id: "1",
      name: "Global healthx",
      city: "Hyderabad",
      phone: "7829556633",
      email: "globalhealthx.co@gmail.com",
      status: "Active",
    },
    {
      id: "2",
      name: "Test Center",
      city: "Lingampayy",
      phone: "98765456789",
      email: "mahithcreddy827+1@gmail.com",
      status: "Active",
    },
    {
      id: "3",
      name: "Little Steps Therapy Center",
      city: "Madhapur",
      phone: "1234567891",
      email: "sowjanya.mekala@ideabytes.com",
      status: "Active",
    },
    {
      id: "4",
      name: "KinderBloom Therapy",
      city: "Hitech City",
      phone: "1234567892",
      email: "alaka.mahith@ideabytes.com",
      status: "Active",
    },
    {
      id: "5",
      name: "Growing Together Therapy",
      city: "Kondapur",
      phone: "1234567892",
      email: "21311a05j@greenidhi.edu.in",
      status: "Active",
    },
    {
      id: "6",
      name: "Mindful therapy center",
      city: "Hyderabad",
      phone: "9491871971",
      email: "kartik.datrika@cognitivebotics.com",
      status: "Active",
    },
    {
      id: "7",
      name: "Bright Minds Therapy",
      city: "Lingampally",
      phone: "1234567891",
      email: "sowjanya.mekala94@gmail.com",
      status: "Active",
    },
  ]);

  const handleLogin = () => {
    if (email === "superadmin@gmail.com" && password === "1234") {
      setIsAuthed(true);
      setRole("admin");
      setError("");
      return;
    }
    if (email === "therapycenter@gmail.com" && password === "1234") {
      setIsAuthed(true);
      setRole("therapy");
      setError("");
      return;
    }
    if (email === "therapist@gmail.com" && password === "1234") {
      setIsAuthed(true);
      setRole("therapist");
      setError("");
      return;
    }
    setError("Invalid email or password.");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      phone: "",
      email: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleAddCenterClick = () => {
    resetForm();
    setView("add");
  };

  const handleEditCenter = (id: string) => {
    const center = centers.find((item) => item.id === id);
    if (!center) {
      return;
    }
    setFormData({
      name: center.name,
      address: center.address ?? "",
      city: center.city ?? "",
      state: center.state ?? "",
      country: center.country ?? "",
      postalCode: center.postalCode ?? "",
      phone: center.phone ?? "",
      email: center.email ?? "",
      description: center.description ?? "",
    });
    setEditingId(id);
    setView("add");
  };

  const handleToggleStatus = (id: string) => {
    setCenters((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "Active" ? "Inactive" : "Active",
            }
          : item
      )
    );
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      return;
    }
    if (editingId) {
      setCenters((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: formData.name,
                city: formData.city,
                phone: formData.phone,
                email: formData.email,
                address: formData.address,
                state: formData.state,
                country: formData.country,
                postalCode: formData.postalCode,
                description: formData.description,
              }
            : item
        )
      );
    } else {
      setCenters((prev) => [
        {
          id: `${Date.now()}`,
          name: formData.name,
          city: formData.city,
          phone: formData.phone,
          email: formData.email,
          status: "Active",
          address: formData.address,
          state: formData.state,
          country: formData.country,
          postalCode: formData.postalCode,
          description: formData.description,
        },
        ...prev,
      ]);
    }
    setView("centers");
    resetForm();
  };

  const handleCancel = () => {
    setView("centers");
    resetForm();
  };

  const addCenterTitle = useMemo(
    () => (editingId ? "Edit Center" : "Add Center"),
    [editingId]
  );

  useEffect(() => {
    if (!showToast) {
      return;
    }
    const timeout = setTimeout(() => setShowToast(false), 2500);
    return () => clearTimeout(timeout);
  }, [showToast]);

  useEffect(() => {
    if (!showChildToast) {
      return;
    }
    const timeout = setTimeout(() => setShowChildToast(false), 2500);
    return () => clearTimeout(timeout);
  }, [showChildToast]);

  useEffect(() => {
    if (!showScheduleToast) {
      return;
    }
    const timeout = setTimeout(() => setShowScheduleToast(false), 2500);
    return () => clearTimeout(timeout);
  }, [showScheduleToast]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    const handleTimeUpdate = () => {
      if (!video.duration) {
        return;
      }
      setVideoCurrentTime(video.currentTime);
      setVideoProgress((video.currentTime / video.duration) * 100);
    };
    const handleLoaded = () => {
      if (video.duration) {
        setVideoDuration(video.duration);
      }
    };
    const handleEnded = () => setIsPlaying(false);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("ended", handleEnded);
    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("ended", handleEnded);
    };
  }, [selectedSessionId]);

  const resetTherapistForm = () => {
    setTherapistForm({
      role: "",
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleTherapistSave = () => {
    if (!therapistForm.name.trim()) {
      return;
    }
    setTherapists((prev) => [
      {
        id: `${Date.now()}`,
        name: therapistForm.name,
        email: therapistForm.email,
        role: therapistForm.role.toLowerCase(),
        status: "Active",
      },
      ...prev,
    ]);
    setTherapyView("list");
    resetTherapistForm();
    setShowToast(true);
  };

  const handleTherapistCancel = () => {
    setTherapyView("list");
    resetTherapistForm();
  };

  const resetChildForm = () => {
    setChildForm({
      name: "",
      dob: "",
      diagnosis: "",
      parentContact: "",
      therapistId: "",
      icdCode: "",
      insurance: "",
      intakeNotes: "",
      photoName: "",
    });
  };

  const handleChildSave = () => {
    if (!childForm.name.trim()) {
      return;
    }
    const ageValue = childForm.dob
      ? `${new Date().getFullYear() - new Date(childForm.dob).getFullYear()} years`
      : "";
    setChildren((prev) => [
      {
        id: `${Date.now()}`,
        name: childForm.name,
        diagnosis: childForm.diagnosis || "-",
        therapistId: childForm.therapistId,
        status: "Active",
        age: ageValue,
      },
      ...prev,
    ]);
    setChildView("list");
    resetChildForm();
    setShowChildToast(true);
  };

  const handleChildCancel = () => {
    setChildView("list");
    resetChildForm();
  };

  const handleScheduleOpen = (id: string) => {
    setScheduleChildId(id);
    setScheduleForm({
      date: "",
      time: "",
      meridiem: "AM",
      duration: "",
      rbtId: "",
      bcbaNotes: "",
    });
  };

  const handleScheduleCancel = () => {
    setScheduleChildId(null);
  };

  const handleScheduleSave = () => {
    setScheduleChildId(null);
    setShowScheduleToast(true);
  };

  const handlePlayToggle = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (deltaSeconds: number) => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    video.currentTime = Math.max(
      0,
      Math.min(video.duration || 0, video.currentTime + deltaSeconds)
    );
  };

  const handleTimelineClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const video = videoRef.current;
    if (!video || !video.duration) {
      return;
    }
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    video.currentTime = Math.min(video.duration, Math.max(0, ratio * video.duration));
  };

  const handleSeekTo = (seconds: number) => {
    const video = videoRef.current;
    if (!video || !video.duration) {
      return;
    }
    video.currentTime = Math.min(video.duration, Math.max(0, seconds));
  };

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const parseTimestamp = (value: string) => {
    const [mins, secs] = value.split(":");
    return Number(mins || 0) * 60 + Number(secs || 0);
  };

  const handleOpenBehaviorModal = () => {
    setBehaviorModalMode("add");
    setEditingSerial(null);
    setBehaviorForm((prev) => ({
      ...prev,
      timestamp: formatTimestamp(videoCurrentTime),
      category: "",
      severity: "Moderate",
      notes: "",
    }));
    setIsBehaviorModalOpen(true);
  };

  const handleCloseBehaviorModal = () => {
    setIsBehaviorModalOpen(false);
  };

  const handleAddBehavior = () => {
    const startSeconds = parseTimestamp(behaviorForm.timestamp);
    if (!behaviorForm.category) {
      return;
    }
    if (behaviorModalMode === "edit" && editingSerial !== null) {
      setSessionBehaviorMap((prev) => {
        const key = selectedSessionId ?? "0";
        const updated = (prev[key] || []).map((item: Behavior) =>
          item.serial_number === editingSerial
            ? {
                ...item,
                behavior: behaviorForm.category.toLowerCase(),
                start_timestamp: startSeconds,
                end_timestamp: startSeconds + 2,
                severity: behaviorForm.severity,
                notes: behaviorForm.notes,
                source: item.source ?? "AI",
              }
            : item
        );
        return { ...prev, [key]: updated };
      });
    } else {
      setSessionBehaviorMap((prev) => {
        const key = selectedSessionId ?? "0";
        const existing = prev[key] || [];
        return {
          ...prev,
          [key]: [
            ...existing,
            {
              serial_number:
                existing.reduce<number>(
                  (max, item) => Math.max(max, item.serial_number),
                  0
                ) + 1,
              behavior: behaviorForm.category.toLowerCase(),
              start_timestamp: startSeconds,
              end_timestamp: startSeconds + 2,
              severity: behaviorForm.severity,
              notes: behaviorForm.notes,
              source: "Therapist",
            },
          ],
        };
      });
    }
    setBehaviorForm({
      timestamp: formatTimestamp(startSeconds),
      category: "",
      severity: "Moderate",
      notes: "",
    });
    setIsBehaviorModalOpen(false);
  };

  const handleEditBehavior = (item: Behavior) => {
    setBehaviorModalMode("edit");
    setEditingSerial(item.serial_number);
    setBehaviorForm({
      timestamp: formatTimestamp(item.start_timestamp),
      category: item.behavior,
      severity: item.severity || "Moderate",
      notes: item.notes || "",
    });
    setIsBehaviorModalOpen(true);
  };

  const handleDeleteBehavior = (serial: number) => {
    setSessionBehaviorMap((prev) => {
      const key = selectedSessionId ?? "0";
      return {
        ...prev,
        [key]: (prev[key] || []).filter((item) => item.serial_number !== serial),
      };
    });
  };

  const buildReportHtml = (
    behaviors: Behavior[],
    subjectName: string,
    sessionDate: string,
    sessionDuration: string,
    therapistName: string,
    sessionId: string
  ) => {
    const totalBehaviors = behaviors.length;
    const behaviorCounts = behaviors.reduce<Record<string, number>>(
      (acc, item) => {
        acc[item.behavior] = (acc[item.behavior] || 0) + 1;
        return acc;
      },
      {}
    );
    const dominantEntry = Object.entries(behaviorCounts).sort(
      (a, b) => b[1] - a[1]
    )[0];
    const dominantBehavior = dominantEntry?.[0] ?? "-";
    const dominantCount = dominantEntry?.[1] ?? 0;
    const aiCount = behaviors.filter((item) => item.source === "AI").length;
    const therapistCount = behaviors.filter(
      (item) => item.source === "Therapist"
    ).length;
    const categoryMap: Record<string, string> = {
      hitting: "Aggression",
      "hair pulling": "Aggression",
      throwing: "Disruptive Behaviors",
      "out of seat": "Disruptive Behaviors",
      "non-compliance": "Avoidance/Escape Behaviors",
      screaming: "Vocal Stereotypy",
      whimpering: "Vocal Stereotypy",
    };
    const categoryOrder = [
      "Aggression",
      "Disruptive Behaviors",
      "Motor Stereotypy",
      "Vocal Stereotypy",
      "Avoidance/Escape Behaviors",
    ];
    const categoryColors: Record<string, string> = {
      Aggression: "#2d5fcc",
      "Disruptive Behaviors": "#f57c00",
      "Motor Stereotypy": "#7a5cff",
      "Vocal Stereotypy": "#16a34a",
      "Avoidance/Escape Behaviors": "#e02424",
    };
    const categoryCounts = behaviors.reduce<Record<string, number>>(
      (acc, item) => {
        const category = categoryMap[item.behavior] || "Disruptive Behaviors";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {}
    );
    const categoryCards = categoryOrder
      .map((category) => {
        const items = Object.entries(behaviorCounts)
          .filter(
            ([name]) => (categoryMap[name] || "Disruptive Behaviors") === category
          )
          .map(([name, count]) => `<div>${name}<span>${count}</span></div>`)
          .join("");
        return `<div class="breakdown-card">
          <div class="breakdown-title">${category}</div>
          <div class="breakdown-count" style="color:${categoryColors[category]}">
            ${categoryCounts[category] || 0}
          </div>
          <div class="breakdown-list">${items || "<span class='muted'>No data</span>"}</div>
        </div>`;
      })
      .join("");
    const behaviorLogRows = behaviors
      .map((item) => {
        const start = formatTimestamp(item.start_timestamp);
        const end = formatTimestamp(item.end_timestamp);
        const sourceLabel =
          item.source === "Therapist" ? "Therapist Reviewed" : "AI Detected";
        return `<tr>
          <td>${start}–${end}</td>
          <td>${item.behavior}</td>
          <td>Behavior observed during session.</td>
          <td><span class="source-pill ${
            item.source === "Therapist" ? "source-therapist" : "source-ai"
          }">${sourceLabel}</span></td>
        </tr>`;
      })
      .join("");
    const timelineTicks = behaviors
      .map((item) => {
        const left = Math.min(100, (item.start_timestamp / 120) * 100);
        const category = categoryMap[item.behavior] || "Disruptive Behaviors";
        const color = categoryColors[category] || "#2d5fcc";
        return `<span class="timeline-tick" style="left:${left}%; background:${color}"></span>`;
      })
      .join("");
    const chartLines = categoryOrder
      .map((category, index) => {
        const base = categoryCounts[category] || 1;
        const points = [0, 1, 2, 3, 4, 5].map((i) => {
          const value = Math.max(1, base + ((i + index) % 3) - 1);
          const x = 40 + i * 90;
          const y = 120 - value * 8;
          return `${x},${y}`;
        });
        return `<polyline fill="none" stroke="${categoryColors[category]}" stroke-width="2" points="${points.join(" ")}" />`;
      })
      .join("");

    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Behavior Analysis Report</title>
        <style>
          @page { size: A4; margin: 14mm; }
          body { font-family: "Inter", Arial, sans-serif; color: #111827; margin: 0; background: #ffffff; }
          .page { background: #ffffff; page-break-after: always; }
          .page:last-child { page-break-after: auto; }
          .container { padding: 18px 20px; }
          h1 { font-size: 20px; margin: 0; }
          h2 { font-size: 14px; margin: 18px 0 10px; }
          .subtitle { color: #6b7280; font-size: 11px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; }
          .profile { display: grid; grid-template-columns: 70px 1fr auto; gap: 12px; padding: 14px 0; border-bottom: 1px solid #e5e7eb; }
          .avatar { width: 56px; height: 56px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-weight: 600; color: #1d4ed8; }
          .profile-meta { font-size: 11px; color: #6b7280; line-height: 1.4; }
          .profile-right { font-size: 11px; color: #6b7280; text-align: right; }
          .profile-right strong { display: block; color: #111827; }
          .summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
          .card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px; background: #ffffff; }
          .card h3 { margin: 0 0 6px 0; font-size: 11px; color: #6b7280; font-weight: 600; }
          .card strong { font-size: 18px; display: block; }
          .card-accent { background: #eaf2ff; }
          .pill { display: inline-block; border-radius: 999px; padding: 4px 8px; font-size: 10px; font-weight: 600; }
          .pill-ai { background: #dbeafe; color: #1d4ed8; }
          .pill-therapist { background: #dcfce7; color: #15803d; }
          .trend { border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; background: #ffffff; }
          .trend-top { display: flex; gap: 16px; font-size: 11px; color: #6b7280; margin-bottom: 8px; flex-wrap: wrap; }
          .trend-chart { margin-top: 4px; }
          .trend-legend { font-size: 10px; color: #6b7280; display: flex; gap: 14px; flex-wrap: wrap; margin-top: 6px; }
          .legend-dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; margin-right: 6px; }
          .breakdown { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
          .breakdown-card { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px; background: #ffffff; font-size: 11px; }
          .breakdown-title { font-weight: 600; margin-bottom: 4px; }
          .breakdown-count { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
          .breakdown-list div { display: flex; justify-content: space-between; color: #6b7280; }
          .timeline { border: 1px solid #e5e7eb; border-radius: 10px; padding: 10px; background: #ffffff; display: grid; grid-template-columns: 1fr 80px; gap: 10px; }
          .timeline-bar { position: relative; height: 30px; border-radius: 8px; background: #f3f4f6; overflow: hidden; }
          .timeline-tick { position: absolute; top: 6px; width: 2px; height: 18px; }
          .timeline-legend { display: flex; gap: 12px; font-size: 10px; color: #6b7280; margin-top: 6px; flex-wrap: wrap; }
          .qr { width: 80px; height: 80px; border: 1px solid #e5e7eb; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #9ca3af; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; background: #ffffff; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
          th { color: #6b7280; font-weight: 600; background: #f9fafb; }
          .source-pill { border-radius: 999px; padding: 3px 6px; font-size: 10px; font-weight: 600; display: inline-block; }
          .source-ai { background: #dbeafe; color: #1d4ed8; }
          .source-therapist { background: #dcfce7; color: #15803d; }
          .insights { border: 1px solid #c7d2fe; border-radius: 10px; padding: 12px; background: #eef2ff; font-size: 11px; color: #374151; }
          .disclaimer { font-size: 10px; color: #9ca3af; margin-top: 16px; border-top: 1px solid #e5e7eb; padding-top: 8px; }
          .footer { font-size: 10px; color: #9ca3af; margin-top: 16px; display: flex; justify-content: center; gap: 16px; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="container">
            <div class="header">
              <div>
                <h1>Behavior Analysis Report</h1>
                <div class="subtitle">Child Therapy Session — AI-Assisted Review</div>
              </div>
            </div>

            <div class="profile">
              <div class="avatar">AJ</div>
              <div>
                <strong>${subjectName}</strong>
                <div class="profile-meta">Age: 7 years</div>
                <div class="profile-meta">Diagnosis: Autism Spectrum Disorder (ASD)</div>
              </div>
              <div class="profile-right">
                <div><span class="subtitle">Session Date</span><strong>${sessionDate}</strong></div>
                <div><span class="subtitle">Therapist</span><strong>${therapistName}</strong></div>
                <div><span class="subtitle">Duration</span><strong>${sessionDuration}</strong></div>
                <div><span class="subtitle">Session ID</span><strong>${sessionId}</strong></div>
              </div>
            </div>

            <h2>Session Summary</h2>
            <div class="summary">
              <div class="card">
                <h3>Total Behavior Instances</h3>
                <strong>${totalBehaviors}</strong>
              </div>
              <div class="card card-accent">
                <h3>Dominant Behavior</h3>
                <strong>${dominantBehavior}</strong>
                <div class="subtitle">${dominantCount} instances</div>
              </div>
              <div class="card">
                <h3>AI vs Therapist Review</h3>
                <span class="pill pill-ai">AI Detected ${aiCount}</span>
                <span class="pill pill-therapist">Therapist Reviewed ${therapistCount}</span>
              </div>
              <div class="card">
                <h3>Compared to last 7 sessions</h3>
                <strong style="color:#16a34a;">+12%</strong>
                <div class="subtitle">Slight increase in overall frequency</div>
              </div>
            </div>

            <h2>Behavior Trend Over Time</h2>
            <div class="trend">
              <div class="trend-top">
                <span>Current Session: ${sessionDate}</span>
                ${categoryOrder
                  .map(
                    (category) =>
                      `<span><strong>${categoryCounts[category] || 0}</strong> ${category.split(" ")[0]}</span>`
                  )
                  .join("")}
              </div>
              <div class="trend-chart">
                <svg width="100%" height="160" viewBox="0 0 560 160">
                  <rect x="0" y="0" width="560" height="160" rx="10" fill="#f8fafc" />
                  ${chartLines}
                </svg>
              </div>
              <div class="trend-legend">
                ${categoryOrder
                  .map(
                    (category) =>
                      `<span><span class="legend-dot" style="background:${categoryColors[category]}"></span>${category}</span>`
                  )
                  .join("")}
              </div>
            </div>

            <h2>Behavior Breakdown — This Session</h2>
            <div class="breakdown">${categoryCards}</div>

            <h2>Behavior Timeline Overview</h2>
            <div class="timeline">
              <div>
                <div class="subtitle">Visual representation of when behaviors occurred during the session</div>
                <div class="timeline-bar">${timelineTicks}</div>
                <div class="timeline-legend">
                  ${categoryOrder
                    .map(
                      (category) =>
                        `<span><span class="legend-dot" style="background:${categoryColors[category]}"></span>${category}</span>`
                    )
                    .join("")}
                </div>
              </div>
              <div class="qr">QR</div>
            </div>
          </div>
        </div>

        <div class="page">
          <div class="container">
            <h2>Behavior Log</h2>
            <table>
              <thead>
                <tr><th>Timestamp</th><th>Behavior</th><th>Description</th><th>Source</th></tr>
              </thead>
              <tbody>${behaviorLogRows}</tbody>
            </table>

            <h2>Therapist Insights</h2>
            <div class="insights">
              Today's session showed progress in several areas. The child demonstrated improved response to visual schedules and responded well to positive reinforcement strategies.
              <br /><br />
              Key observations:
              <ul>
                <li>Most aggressive behaviors occurred during task transitions, suggesting need for more transition warnings</li>
                <li>Child showed good engagement during preferred activities (puzzle completion, sensory play)</li>
                <li>Self-injurious behaviors decreased when given access to fidget tools</li>
                <li>Recommend continuing current behavior intervention plan with added focus on transition support</li>
              </ul>
              The slight increase in overall behaviors compared to last week appears related to schedule changes at home (parent reported sleep disruption). Will monitor next session.
            </div>

            <div class="disclaimer">
              Important Disclaimer<br />
              This report is intended to support therapy planning and should be interpreted by a qualified professional. The data presented combines AI-assisted detection with professional therapist review for accuracy.
            </div>

            <div class="footer">
              <span>Generated by AI + Therapist Review</span>
              <span>January 20, 2026 at 2:45 PM EST</span>
            </div>
          </div>
        </div>
      </body>
    </html>`;
  };

  const handleExportReport = async (
    behaviors: Behavior[],
    subjectName: string
  ) => {
    const reportHtml = buildReportHtml(
      behaviors,
      subjectName,
      "February 28, 2026",
      "45 minutes",
      "Dr. Sarah Johnson, BCBA",
      "903-0509-02-95-801"
    );
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.left = "-9999px";
    iframe.style.top = "0";
    iframe.style.width = "794px";
    iframe.style.height = "1123px";
    document.body.appendChild(iframe);
    const iframeDoc = iframe.contentDocument;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      return;
    }
    iframeDoc.open();
    iframeDoc.write(reportHtml);
    iframeDoc.close();

    await new Promise<void>((resolve) => {
      iframe.onload = () => resolve();
      setTimeout(() => resolve(), 300);
    });

    const pages = Array.from(
      iframeDoc.querySelectorAll<HTMLElement>(".page")
    );
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });
    const pageWidth = 210;
    const pageHeight = 297;

    for (let index = 0; index < pages.length; index += 1) {
      const page = pages[index];
      const canvas = await html2canvas(page, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imageData = canvas.toDataURL("image/png");
      if (index > 0) {
        pdf.addPage();
      }
      pdf.addImage(imageData, "PNG", 0, 0, pageWidth, pageHeight);
    }

    pdf.save("behavior-analysis-report.pdf");
    document.body.removeChild(iframe);
  };

  if (isAuthed && role === "therapist") {
    const therapistChildren = [
      "demo child_scene 1",
      "demo child_scene 2",
      "demo child_scene 3",
      "demo child_scene 4",
      "demo child_scene 5",
      "demo child_scene 6",
      "demo child_scene 7",
    ];
    const activeChildName =
      selectedChildId && therapistChildren[parseInt(selectedChildId, 10)]
        ? therapistChildren[parseInt(selectedChildId, 10)]
        : therapistChildren[0];
  return (
      <div className={styles.dashboardPage}>
        <header className={styles.dashboardHeader}>
          <div className={styles.brand}>Video Analytics</div>
          <nav className={styles.nav}>
            <span className={styles.navItem}>Dashboard</span>
            <span className={`${styles.navItem} ${styles.navActive}`}>
              Children
            </span>
            <span className={styles.navItem}>Reports</span>
            <div className={styles.avatar}>U</div>
          </nav>
        </header>
        <main className={styles.dashboardContent}>
          {selectedChildId === null ? (
            <section className={styles.childrenProfiles}>
              <h1 className={styles.pageTitle}>Child Profiles</h1>
              <div className={styles.searchWithIcon}>
                <span className={styles.searchIcon} aria-hidden="true">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M20 20l-3.5-3.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <input
                  className={styles.profileSearch}
                  placeholder="Search by name"
                />
              </div>
              <div className={styles.profileGrid}>
                {therapistChildren.map((name, index) => (
                  <button
                    className={styles.profileCard}
                    key={name}
                    type="button"
                    onClick={() => setSelectedChildId(String(index))}
                  >
                    <div className={styles.profileImage}>
                      <div className={styles.profilePortrait} />
                    </div>
                    <div className={styles.profileName}>{name}</div>
                    <div className={styles.profileMeta}>Age: 8 years</div>
                    <div className={styles.profileMeta}>
                      Last Session: Sep 9, 2025, 12:{17 + index} PM
                    </div>
                    <div className={styles.profileMeta}>Total Sessions: 3</div>
                  </button>
                ))}
              </div>
            </section>
          ) : selectedSessionId ? (
            <section className={styles.sessionReview}>
              {(() => {
                const sessionKey = selectedSessionId ?? "0";
                const reportSubjectName = activeChildName || "Child A";
                const behaviors: Behavior[] = sessionBehaviorMap[sessionKey] || [];
                const sessionVideoMap: Record<string, string> = {
                  "0": "/video_behaviors_labeled.mp4",
                  "1": "/video2_behaviors_labeled.mp4",
                };
                const currentVideo =
                  sessionVideoMap[sessionKey] ?? "/video_behaviors_labeled.mp4";
                const totalBehaviors = behaviors.length;
                const behaviorCounts = behaviors.reduce<Record<string, number>>(
                  (acc, item: Behavior) => {
                    acc[item.behavior] = (acc[item.behavior] || 0) + 1;
                    return acc;
                  },
                  {}
                );
                const behaviorColors: Record<string, string> = {
                  "non-compliance": styles.behaviorBlue,
                  "hair pulling": styles.behaviorGreen,
                  throwing: styles.behaviorSky,
                  whimpering: styles.behaviorPurple,
                  hitting: styles.behaviorOrange,
                  "out of seat": styles.behaviorTeal,
                  screaming: styles.behaviorRed,
                };
                const maxTimestamp = Math.max(
                  Math.ceil(videoDuration || 0),
                  ...behaviors.map((item) => item.end_timestamp)
                );
                const zoomSeconds = Math.min(
                  maxTimestamp,
                  Math.max(5, timelineZoom)
                );
                const windowStart = Math.max(
                  0,
                  Math.min(
                    maxTimestamp - zoomSeconds,
                    videoCurrentTime - zoomSeconds / 2
                  )
                );
                const windowEnd = Math.min(maxTimestamp, windowStart + zoomSeconds);
                return (
                  <>
                    <button
                      className={styles.backLink}
                      type="button"
                      onClick={() => setSelectedSessionId(null)}
                    >
                      ← Back
                    </button>
                    <div className={styles.sessionHeader}>
                      <div className={styles.sessionTitleRow}>
                        <div className={styles.sessionTitle}>Session Review</div>
                        <button
                          className={styles.exportButton}
                          type="button"
                          onClick={() => handleExportReport(behaviors, reportSubjectName)}
                        >
                          Export Report
                        </button>
                      </div>
                <div className={styles.sessionPills}>
                  <span className={styles.sessionPill}>
                    {totalBehaviors} Behaviors
                  </span>
                  <span className={styles.sessionPill}>0 Pending</span>
                </div>
                <div className={styles.sessionMeta}>
                  <span>
                    <strong>Subject:</strong> Child A
                  </span>
                  <span>
                    <strong>Date:</strong> Sep 9, 2025
                  </span>
                  <span>
                    <strong>Duration:</strong> 01:15:47
                  </span>
                  <span>
                    <strong>Therapist:</strong> Jane D.
                  </span>
                </div>
              </div>
              <div className={styles.videoCard}>
                <video
                  className={styles.video}
                  ref={videoRef}
                    src={currentVideo}
                />
                <div className={styles.videoTimeline} onClick={handleTimelineClick}>
                  <div
                    className={styles.videoProgress}
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                <div className={styles.videoActions}>
                  <div className={styles.videoControls}>
                    <button
                      className={styles.videoButton}
                      type="button"
                      onClick={handlePlayToggle}
                    >
                      {isPlaying ? "❚❚ Pause" : "▶ Play"}
                    </button>
                    <button
                      className={styles.videoGhostButton}
                      type="button"
                      onClick={() => handleSeek(-5)}
                    >
                      ⏮ 5s
                    </button>
                    <button
                      className={styles.videoGhostButton}
                      type="button"
                      onClick={() => handleSeek(5)}
                    >
                      5s ⏭
                    </button>
        </div>
                  <button
                    className={styles.addBehaviorButton}
                    type="button"
                    onClick={handleOpenBehaviorModal}
                  >
                    + Add Behavior
                  </button>
                </div>
              </div>
              <section className={styles.behaviorTimeline}>
                <div className={styles.timelineHeader}>
                  <span>Timeline</span>
                  <span className={styles.timelineViewing}>
                    Viewing: {formatTimestamp(windowStart)} -{" "}
                    {formatTimestamp(windowEnd)}
                  </span>
                  <span className={styles.timelineZoom}>Timeline Zoom:</span>
                  <input
                    className={styles.timelineZoomBar}
                    type="range"
                    min={5}
                    max={maxTimestamp}
                    value={zoomSeconds}
                    onChange={(event) =>
                      setTimelineZoom(Number(event.target.value))
                    }
                  />
                </div>
                <div className={styles.timelineTrack}>
                  <div className={styles.timelineBase} />
                  <div
                    className={styles.timelineMarker}
                    style={{
                      left: `${((videoCurrentTime - windowStart) / zoomSeconds) * 100}%`,
                    }}
                  >
                    <span className={styles.timelineDot} />
                    <span className={styles.timelineLine} />
        </div>
                </div>
                <div className={styles.timelineTicks}>
                  {Array.from({ length: 5 }).map((_, index) => {
                    const value =
                      windowStart + (zoomSeconds / 4) * index;
                    return <span key={index}>{formatTimestamp(value)}</span>;
                  })}
                </div>
                <div className={styles.timelineBehaviorTrack}>
                  {behaviors
                    .filter(
                      (item) =>
                        item.end_timestamp >= windowStart &&
                        item.start_timestamp <= windowEnd
                    )
                    .map((item) => {
                      const start = Math.max(item.start_timestamp, windowStart);
                      const end = Math.min(item.end_timestamp, windowEnd);
                      const left = ((start - windowStart) / zoomSeconds) * 100;
                      const width =
                        ((end - start) / zoomSeconds) * 100 || 1;
                      return (
                        <button
                          key={item.serial_number}
                          className={`${styles.timelineBehaviorBar} ${
                            behaviorColors[item.behavior] ?? styles.behaviorBlue
                          }`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                          type="button"
                          onClick={() => handleSeekTo(item.start_timestamp)}
                        />
                      );
                    })}
                </div>
                <div className={styles.timelineRow}>
                  <div className={styles.timelineRowHeader}>
                    <span>AI Detections</span>
                    <span>4/40</span>
                  </div>
                  <div className={styles.timelineBands}>
                    <span className={`${styles.timelineBand} ${styles.behaviorBlue}`}>
                      Avoidance/Escape Behaviors
                    </span>
                    <span className={`${styles.timelineBand} ${styles.behaviorGreen}`}>
                      Vocal Stereotypy
                    </span>
                  </div>
                </div>
                <div className={styles.timelineRow}>
                  <div className={styles.timelineRowHeader}>
                    <span>Manual Annotations</span>
                    <span>0</span>
                  </div>
                  <div className={styles.timelineEmpty}>No manual annotations</div>
                </div>
              </section>
              <section className={styles.behaviorSummary}>
                <div className={styles.summaryTitle}>
                  Total behaviors - <span>{totalBehaviors}</span>
                </div>
                <div className={styles.summaryChips}>
                  {Object.entries(behaviorCounts).map(([name, count]) => (
                    <button
                      key={name}
                      className={styles.summaryChip}
                      type="button"
                      onClick={() =>
                        handleSeekTo(
                          behaviors.find((item) => item.behavior === name)
                            ?.start_timestamp ?? 0
                        )
                      }
                    >
                      <span>{String(count).padStart(2, "0")}</span> {name}
                    </button>
                  ))}
        </div>
              </section>
              <section className={styles.behaviorTable}>
                <div className={styles.behaviorTableHeader}>
                  <span>
                    All Behaviors <span className={styles.behaviorCount}>{totalBehaviors} total</span>
                  </span>
                  <button
                    className={styles.addBehaviorButton}
                    type="button"
                    onClick={handleOpenBehaviorModal}
                  >
                    + Add Behavior
                  </button>
                </div>
                <div className={styles.behaviorTableRow}>
                  <span>Time</span>
                  <span>Source</span>
                  <span>Category</span>
                  <span>Behavior</span>
                  <span>Severity</span>
                  <span>Description</span>
                  <span>Confidence</span>
                  <span>Notes</span>
                  <span>Actions</span>
                </div>
                {behaviors.map((item) => (
                  <div
                    key={item.serial_number}
                    className={styles.behaviorTableRow}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleSeekTo(item.start_timestamp)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleSeekTo(item.start_timestamp);
                      }
                    }}
                  >
                    <span className={styles.timePill}>
                      {formatTimestamp(item.start_timestamp)}
                    </span>
                    <span>{item.source ?? "AI"}</span>
                    <span
                      className={`${styles.categoryPill} ${
                        behaviorColors[item.behavior] ?? styles.behaviorBlue
                      }`}
                    >
                      {item.behavior}
                    </span>
                    <span>{item.behavior}</span>
                    <span className={styles.severityPill}>
                      {item.severity || "Moderate"}
                    </span>
                    <span className={styles.tableDescription}>
                      Behavior observed during session.
                    </span>
                    <span className={styles.confidencePill}>80%</span>
                    <span className={styles.tableMuted}>
                      {item.notes ? item.notes : "No notes"}
                    </span>
                    <span className={styles.tableActions}>
                      <button
                        className={styles.iconButton}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleEditBehavior(item);
                        }}
                      >
                        ✎
                      </button>
                      <button
                        className={styles.iconButton}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteBehavior(item.serial_number);
                        }}
                      >
                        ⌫
                      </button>
                    </span>
                  </div>
                ))}
              </section>
              <div className={styles.behaviorSpacing} />
              {isBehaviorModalOpen ? (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalCard}>
                    <div className={styles.modalHeader}>
                      <div>
                        <div className={styles.modalTitle}>
                          {behaviorModalMode === "edit"
                            ? "Edit Behavior"
                            : "Add New Behavior"}
                        </div>
                        <div className={styles.modalSubtitle}>
                          Create a new behavior annotation at the current video
                          time.
                        </div>
                      </div>
                      <button
                        className={styles.modalClose}
                        type="button"
                        onClick={handleCloseBehaviorModal}
                      >
                        ×
                      </button>
                    </div>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Timestamp</span>
                      <input
                        className={styles.formInput}
                        value={behaviorForm.timestamp}
                        onChange={(event) =>
                          setBehaviorForm((prev) => ({
                            ...prev,
                            timestamp: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className={styles.modalGrid}>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>Category</span>
                        <select
                          className={styles.formSelect}
                          value={behaviorForm.category}
                          onChange={(event) =>
                            setBehaviorForm((prev) => ({
                              ...prev,
                              category: event.target.value,
                            }))
                          }
                        >
                          <option value="">Select</option>
                          <option value="non-compliance">Non-Compliance</option>
                          <option value="hair pulling">Hair Pulling</option>
                          <option value="throwing">Throwing</option>
                          <option value="whimpering">Whimpering</option>
                          <option value="hitting">Hitting</option>
                          <option value="out of seat">Out of Seat</option>
                          <option value="screaming">Screaming</option>
                        </select>
                        <span className={styles.modalHint}>
                          Select the most appropriate behavior category
                        </span>
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>Severity Level</span>
                        <select
                          className={styles.formSelect}
                          value={behaviorForm.severity}
                          onChange={(event) =>
                            setBehaviorForm((prev) => ({
                              ...prev,
                              severity: event.target.value,
                            }))
                          }
                        >
                          <option>Moderate</option>
                          <option>Mild</option>
                          <option>Severe</option>
                        </select>
                        <span className={styles.modalHint}>
                          How severe is this behavior?
                        </span>
                      </label>
                    </div>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Notes (Optional)</span>
                      <textarea
                        className={styles.formTextarea}
                        placeholder="Add behavioral incident details, context, and relevant observations..."
                        value={behaviorForm.notes}
                        onChange={(event) =>
                          setBehaviorForm((prev) => ({
                            ...prev,
                            notes: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <div className={styles.modalActions}>
                      <button
                        className={styles.cancelButton}
                        type="button"
                        onClick={handleCloseBehaviorModal}
                      >
                        Cancel
                      </button>
                      <button
                        className={styles.addBehaviorButton}
                        type="button"
                        onClick={handleAddBehavior}
                      >
                        {behaviorModalMode === "edit"
                          ? "Save Behavior"
                          : "Add Behavior"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
                  </>
                );
              })()}
            </section>
          ) : (
            <section className={styles.childOverview}>
              <button
                className={styles.backLink}
                type="button"
                onClick={() => setSelectedChildId(null)}
              >
                ← All Children
              </button>
              <div className={styles.childSummary}>
                <div className={styles.childAvatarLarge}>👧</div>
                <div>
                  <div className={styles.childOverviewTitle}>
                    {activeChildName} - Overview
                  </div>
                  <div className={styles.childMeta}>Age 8 years,</div>
                </div>
              </div>
              <div className={styles.overviewSection}>
                <h2 className={styles.sectionTitle}>
                  Session History & Progress
                </h2>
                <div className={styles.overviewCard}>
                  <div className={styles.overviewRow}>
                    <span>Date & Time</span>
                    <span>Duration</span>
                    <span>Recorded By RBT</span>
                    <span>Status</span>
                    <span>Details</span>
                  </div>
                  {[
                    "Sep 9, 2025, 12:17 PM",
                    "Sep 9, 2025, 12:17 PM",
                    "Sep 5, 2025, 01:35 PM",
                  ].map((item, index) => (
                    <div
                      className={`${styles.overviewRow} ${
                        index === 2 ? styles.rowMuted : ""
                      }`}
                      key={item + index}
                    >
                      <span>{item}</span>
                      <span>-</span>
                      <span>demo RBT</span>
                      <span className={styles.pendingPill}>
                        PENDING REVIEW
                      </span>
                      <button
                        className={styles.viewLink}
                        type="button"
                        onClick={() => setSelectedSessionId(String(index))}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.overviewSection}>
                <h2 className={styles.sectionTitle}>Assigned RBT(s)</h2>
                <div className={styles.assignedCard}>
                  <div className={styles.assignedName}>demo RBT</div>
                  <div className={styles.assignedRole}>
                    Registered Behavior Technician
                  </div>
                </div>
              </div>
              <div className={styles.overviewSection}>
                <h2 className={styles.sectionTitle}>
                  Notes/Communication Log
                </h2>
                <label className={styles.formField}>
                  <span className={styles.formLabel}>BCBA Notes</span>
                  <textarea
                    className={styles.formTextarea}
                    placeholder="Enter notes here..."
                  />
                </label>
              </div>
            </section>
          )}
      </main>
        <footer className={styles.dashboardFooter} />
      </div>
    );
  }

  if (isAuthed && role === "therapy") {
    return (
      <div className={styles.dashboardPage}>
        <header className={styles.dashboardHeader}>
          <div className={styles.brand}>Video Analytics</div>
          <nav className={styles.nav}>
            <span className={styles.navItem}>Dashboard</span>
            <span className={`${styles.navItem} ${styles.navActive}`}>
              Users
            </span>
            <span className={styles.navItem}>Reports</span>
            <span className={styles.navItem}>Billing</span>
            <span className={styles.navItem}>Settings</span>
            <div className={styles.avatar}>U</div>
          </nav>
        </header>
        <main className={styles.dashboardContent}>
          {therapyView === "list" &&
          childView === "list" &&
          scheduleChildId === null ? (
            <>
              <section className={styles.usersSection}>
                <div className={styles.sectionHeader}>
                  <h1 className={styles.pageTitle}>Therapists</h1>
                  <div className={styles.sectionActions}>
                    <div className={styles.searchWithIcon}>
                      <span className={styles.searchIcon} aria-hidden="true">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M20 20l-3.5-3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <input
                        className={styles.searchInput}
                        placeholder="Search by name or email"
                      />
                    </div>
                    <button
                      className={styles.addButton}
                      type="button"
                      onClick={() => setTherapyView("add")}
                    >
                      Add Therapist
                    </button>
                  </div>
                </div>
                <section className={styles.tableCard}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableHeaderCell}>Therapist Name</div>
                    <div className={styles.tableHeaderCell}>Email</div>
                    <div className={styles.tableHeaderCell}>Role</div>
                    <div className={styles.tableHeaderCell}>Status</div>
                    <div className={styles.tableHeaderCell} />
                  </div>
                  {therapists.length === 0 ? (
                    <div className={styles.emptyRow}>No results.</div>
                  ) : (
                    therapists.map((row) => (
                      <div className={styles.tableRow} key={row.id}>
                        <div className={styles.tableCell}>{row.name}</div>
                        <div className={styles.tableCell}>{row.email}</div>
                        <div className={styles.tableCell}>{row.role}</div>
                        <div className={styles.tableCell}>
                          <span className={styles.status}>Active</span>
                        </div>
                        <div className={styles.tableCell}>
                          <span className={styles.ellipsis}>...</span>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              </section>
              <section className={styles.usersSection}>
                <div className={styles.sectionHeader}>
                  <h1 className={styles.pageTitle}>Children</h1>
                  <div className={styles.sectionActions}>
                    <div className={styles.searchWithIcon}>
                      <span className={styles.searchIcon} aria-hidden="true">
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="11"
                            cy="11"
                            r="7"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M20 20l-3.5-3.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </span>
                      <input
                        className={styles.searchInput}
                        placeholder="Search by child name"
                      />
                    </div>
                    <button
                      className={styles.addButton}
                      type="button"
                      onClick={() => setChildView("add")}
                    >
                      Add Child
                    </button>
                  </div>
                </div>
                <section className={styles.tableCard}>
                  <div className={styles.tableRow}>
                    <div className={styles.tableHeaderCell}>Child Name</div>
                    <div className={styles.tableHeaderCell}>Age</div>
                    <div className={styles.tableHeaderCell}>Diagnosis</div>
                    <div className={styles.tableHeaderCell}>
                      Assigned Therapist
                    </div>
                    <div className={styles.tableHeaderCell}>Status</div>
                    <div className={styles.tableHeaderCell}>Actions</div>
                    <div className={styles.tableHeaderCell} />
                  </div>
                  {children.length === 0 ? (
                    <div className={styles.emptyRow}>No results.</div>
                  ) : (
                    children.map((row) => (
                      <div className={styles.tableRow} key={row.id}>
                        <div className={styles.tableCell}>{row.name}</div>
                        <div className={styles.tableCell}>{row.age}</div>
                        <div className={styles.tableCell}>{row.diagnosis}</div>
                        <div className={styles.tableCell}>
                          {therapists.find((t) => t.id === row.therapistId)
                            ?.name ?? "-"}
                        </div>
                        <div className={styles.tableCell}>
                          <span className={styles.status}>Active</span>
                        </div>
                        <div className={styles.tableCell}>
                          <button
                            className={styles.scheduleLink}
                            type="button"
                            onClick={() => handleScheduleOpen(row.id)}
                          >
                            Schedule
                          </button>
                        </div>
                        <div className={styles.tableCell}>
                          <span className={styles.ellipsis}>...</span>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              </section>
              {showToast ? (
                <div className={styles.toast}>
                  <div className={styles.toastTitle}>Success</div>
                  <div className={styles.toastText}>
                    Therapist added successfully
                  </div>
                </div>
              ) : null}
              {showChildToast ? (
                <div className={styles.toast}>
                  <div className={styles.toastTitle}>Success</div>
                  <div className={styles.toastText}>
                    Child added successfully
                  </div>
                </div>
              ) : null}
              {showScheduleToast ? (
                <div className={styles.toast}>
                  <div className={styles.toastTitle}>Success</div>
                  <div className={styles.toastText}>
                    Session successfully scheduled
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <>
              {therapyView === "add" ? (
                <section className={styles.therapistFormWrapper}>
                  <h1 className={styles.addCenterTitle}>Add a Therapist</h1>
                  <div className={styles.formCard}>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Role</span>
                      <select
                        className={styles.formSelect}
                        value={therapistForm.role}
                        onChange={(event) =>
                          setTherapistForm((prev) => ({
                            ...prev,
                            role: event.target.value,
                          }))
                        }
                      >
                        <option value="">Select role</option>
                        <option value="BCBA">BCBA</option>
                        <option value="RBT">RBT</option>
                        <option value="OT">OT</option>
                        <option value="SLT">SLT</option>
                      </select>
                    </label>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Name</span>
                      <input
                        className={styles.formInput}
                        placeholder="Enter full name"
                        value={therapistForm.name}
                        onChange={(event) =>
                          setTherapistForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Phone (Optional)</span>
                      <input
                        className={styles.formInput}
                        placeholder="Enter phone number"
                        value={therapistForm.phone}
                        onChange={(event) =>
                          setTherapistForm((prev) => ({
                            ...prev,
                            phone: event.target.value,
                          }))
                        }
                      />
                    </label>
                    <label className={styles.formField}>
                      <span className={styles.formLabel}>Email</span>
                      <input
                        className={styles.formInput}
                        placeholder="Enter email"
                        value={therapistForm.email}
                        onChange={(event) =>
                          setTherapistForm((prev) => ({
                            ...prev,
                            email: event.target.value,
                          }))
                        }
                      />
                    </label>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      className={styles.cancelButton}
                      type="button"
                      onClick={handleTherapistCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      type="button"
                      onClick={handleTherapistSave}
                    >
                      Save
                    </button>
                  </div>
                </section>
              ) : scheduleChildId ? (
                <section className={styles.scheduleWrapper}>
                  <h1 className={styles.addCenterTitle}>Schedule session</h1>
                  <div className={styles.scheduleHeader}>
                    <div className={styles.childAvatar}>👧</div>
                    <div>
                      <div className={styles.childName}>
                        {children.find((child) => child.id === scheduleChildId)
                          ?.name ?? "Child"}
                      </div>
                      <div className={styles.childMeta}>
                        Age{" "}
                        {children.find((child) => child.id === scheduleChildId)
                          ?.age ?? ""}
                      </div>
                    </div>
                  </div>
                  <div className={styles.scheduleLayout}>
                    <div className={styles.calendarCard}>
                      <div className={styles.calendarTitle}>Select Date</div>
                      <div className={styles.calendarNav}>
                        <button
                          className={styles.calendarButton}
                          type="button"
                        >
                          ‹
                        </button>
                        <div className={styles.calendarMonth}>
                          September 2025
                        </div>
                        <button
                          className={styles.calendarButton}
                          type="button"
                        >
                          ›
                        </button>
                      </div>
                      <div className={styles.calendarWeekdays}>
                        <span>M</span>
                        <span>T</span>
                        <span>W</span>
                        <span>T</span>
                        <span>F</span>
                        <span>S</span>
                        <span>S</span>
                      </div>
                      <div className={styles.calendarGrid}>
                        {[
                          "1",
                          "2",
                          "3",
                          "4",
                          "5",
                          "6",
                          "7",
                          "8",
                          "9",
                          "10",
                          "11",
                          "12",
                          "13",
                          "14",
                          "15",
                          "16",
                          "17",
                          "18",
                          "19",
                          "20",
                          "21",
                          "22",
                          "23",
                          "24",
                          "25",
                          "26",
                          "27",
                          "28",
                          "29",
                          "30",
                          "",
                          "",
                          "",
                          "",
                          "",
                        ].map((day, index) => (
                          <span key={index} className={styles.calendarDay}>
                            {day}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className={styles.scheduleFields}>
                      <div className={styles.scheduleRow}>
                        <label className={styles.formField}>
                          <span className={styles.formLabel}>Time</span>
                          <div className={styles.timeRow}>
                            <select
                              className={styles.formSelect}
                              value={scheduleForm.time}
                              onChange={(event) =>
                                setScheduleForm((prev) => ({
                                  ...prev,
                                  time: event.target.value,
                                }))
                              }
                            >
                              <option value="">--:--</option>
                              {Array.from({ length: 24 }).map((_, index) => {
                                const hour = Math.floor(index / 2) + 1;
                                const minutes = index % 2 === 0 ? "00" : "30";
                                const value = `${hour}:${minutes}`;
                                return (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                );
                              })}
                            </select>
                            <select
                              className={styles.formSelect}
                              value={scheduleForm.meridiem}
                              onChange={(event) =>
                                setScheduleForm((prev) => ({
                                  ...prev,
                                  meridiem: event.target.value,
                                }))
                              }
                            >
                              <option value="AM">AM</option>
                              <option value="PM">PM</option>
                            </select>
                          </div>
                        </label>
                        <label className={styles.formField}>
                          <span className={styles.formLabel}>Duration</span>
                          <select
                            className={styles.formSelect}
                            value={scheduleForm.duration}
                            onChange={(event) =>
                              setScheduleForm((prev) => ({
                                ...prev,
                                duration: event.target.value,
                              }))
                            }
                          >
                            <option value="">Select Duration</option>
                            <option value="30">30 mins</option>
                            <option value="60">1 hour</option>
                            <option value="90">1.5 hours</option>
                          </select>
                        </label>
                      </div>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>RBT</span>
                        <select
                          className={styles.formSelect}
                          value={scheduleForm.rbtId}
                          onChange={(event) =>
                            setScheduleForm((prev) => ({
                              ...prev,
                              rbtId: event.target.value,
                            }))
                          }
                        >
                          <option value="">select</option>
                          {therapists
                            .filter((therapist) => therapist.role === "rbt")
                            .map((therapist) => (
                              <option key={therapist.id} value={therapist.id}>
                                {therapist.name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          BCBA Recommendations
                        </span>
                        <input
                          className={styles.formInput}
                          placeholder=""
                          value={scheduleForm.bcbaNotes}
                          onChange={(event) =>
                            setScheduleForm((prev) => ({
                              ...prev,
                              bcbaNotes: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <div className={styles.formActions}>
                        <button
                          className={styles.cancelButton}
                          type="button"
                          onClick={handleScheduleCancel}
                        >
                          Cancel
                        </button>
                        <button
                          className={styles.saveButton}
                          type="button"
                          onClick={handleScheduleSave}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <section className={styles.childFormWrapper}>
                  <h1 className={styles.addCenterTitle}>Add a Child</h1>
                  <div className={styles.childFormLayout}>
                    <div className={styles.uploadCard}>
                      <div className={styles.uploadTitle}>
                        Upload photo (Optional)
                      </div>
                      <label className={styles.uploadInput}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              photoName: event.target.files?.[0]?.name ?? "",
                            }))
                          }
                        />
                        <span className={styles.uploadButton}>Choose file</span>
                        <span className={styles.uploadFilename}>
                          {childForm.photoName || "No file chosen"}
                        </span>
                      </label>
                    </div>
                    <div className={styles.childFields}>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>Child's Name</span>
                        <input
                          className={styles.formInput}
                          placeholder="Enter full name"
                          value={childForm.name}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              name: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>Date of birth</span>
                        <input
                          className={styles.formInput}
                          type="date"
                          value={childForm.dob}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              dob: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          Diagnosis (if applicable)
                        </span>
                        <input
                          className={styles.formInput}
                          placeholder="Enter diagnosis"
                          value={childForm.diagnosis}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              diagnosis: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          Parent's Contact
                        </span>
                        <input
                          className={styles.formInput}
                          placeholder="Enter contact information"
                          value={childForm.parentContact}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              parentContact: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          Assigned Therapist
                        </span>
                        <select
                          className={styles.formSelect}
                          value={childForm.therapistId}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              therapistId: event.target.value,
                            }))
                          }
                        >
                          <option value="">Select therapist</option>
                          {therapists
                            .filter((therapist) => therapist.role === "bcba")
                            .map((therapist) => (
                              <option key={therapist.id} value={therapist.id}>
                                {therapist.name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          ICD Code (Optional)
                        </span>
                        <input
                          className={styles.formInput}
                          placeholder="Enter ICD code"
                          value={childForm.icdCode}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              icdCode: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          Insurance (Optional)
                        </span>
                        <input
                          className={styles.formInput}
                          placeholder="Enter insurance information"
                          value={childForm.insurance}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              insurance: event.target.value,
                            }))
                          }
                        />
                      </label>
                      <label className={styles.formField}>
                        <span className={styles.formLabel}>
                          Intake Notes (Optional)
                        </span>
                        <textarea
                          className={styles.formTextarea}
                          placeholder="Enter any additional notes"
                          value={childForm.intakeNotes}
                          onChange={(event) =>
                            setChildForm((prev) => ({
                              ...prev,
                              intakeNotes: event.target.value,
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button
                      className={styles.cancelButton}
                      type="button"
                      onClick={handleChildCancel}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.saveButton}
                      type="button"
                      onClick={handleChildSave}
                    >
                      Save
                    </button>
                  </div>
                </section>
              )}
            </>
          )}
        </main>
        <footer className={styles.dashboardFooter} />
      </div>
    );
  }

  if (isAuthed && role === "admin") {
    return (
      <div className={styles.dashboardPage}>
        <header className={styles.dashboardHeader}>
          <div className={styles.brand}>Video Analytics</div>
          <nav className={styles.nav}>
            <span className={styles.navItem}>Dashboard</span>
            <span className={`${styles.navItem} ${styles.navActive}`}>
              Centers
            </span>
            <span className={styles.navItem}>Reports</span>
            <span className={styles.navItem}>Billing</span>
            <span className={styles.navItem}>Settings</span>
            <div className={styles.avatar}>U</div>
          </nav>
        </header>
        <main className={styles.dashboardContent}>
          {view === "centers" ? (
            <>
              <section className={styles.centersHeader}>
                <div>
                  <h1 className={styles.pageTitle}>Centers</h1>
                  <input
                    className={styles.search}
                    placeholder="Search by center name"
                  />
                </div>
                <button
                  className={styles.addButton}
                  type="button"
                  onClick={handleAddCenterClick}
                >
                  Add Center
                </button>
              </section>
              <section className={styles.tableCard}>
                <div className={styles.tableRow}>
                  <div className={styles.tableHeaderCell}>Center Name</div>
                  <div className={styles.tableHeaderCell}>City</div>
                  <div className={styles.tableHeaderCell}>Phone</div>
                  <div className={styles.tableHeaderCell}>Email</div>
                  <div className={styles.tableHeaderCell}>Status</div>
                  <div className={styles.tableHeaderCell}>Actions</div>
                </div>
                {centers.map((row) => (
                  <div className={styles.tableRow} key={row.id}>
                    <div className={styles.tableCell}>{row.name}</div>
                    <div className={styles.tableCell}>{row.city}</div>
                    <div className={styles.tableCell}>{row.phone}</div>
                    <div className={styles.tableCell}>{row.email}</div>
                    <div className={styles.tableCell}>
                      <span
                        className={
                          row.status === "Active"
                            ? styles.status
                            : `${styles.status} ${styles.statusInactive}`
                        }
                      >
                        {row.status}
                      </span>
                    </div>
                    <div className={styles.tableCell}>
                      <button
                        className={styles.actionLink}
                        type="button"
                        onClick={() => handleEditCenter(row.id)}
                      >
                        Edit
                      </button>
                      <span className={styles.actionDivider}>|</span>
                      <button
                        className={styles.actionLink}
                        type="button"
                        onClick={() => handleToggleStatus(row.id)}
                      >
                        {row.status === "Active" ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            </>
          ) : (
            <section className={styles.addCenterWrapper}>
              <h1 className={styles.addCenterTitle}>{addCenterTitle}</h1>
              <div className={styles.formCard}>
                <label className={styles.formField}>
                  <span className={styles.formLabel}>Center Name</span>
                  <input
                    className={styles.formInput}
                    placeholder="Enter center name"
                    value={formData.name}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className={styles.formField}>
                  <span className={styles.formLabel}>Address</span>
                  <input
                    className={styles.formInput}
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: event.target.value,
                      }))
                    }
                  />
                </label>
                <div className={styles.formGrid}>
                  <label className={styles.formField}>
                    <span className={styles.formLabel}>City</span>
                    <input
                      className={styles.formInput}
                      placeholder="City"
                      value={formData.city}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className={styles.formField}>
                    <span className={styles.formLabel}>State / Emirate</span>
                    <input
                      className={styles.formInput}
                      placeholder="State"
                      value={formData.state}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <div className={styles.formGrid}>
                  <label className={styles.formField}>
                    <span className={styles.formLabel}>Country</span>
                    <input
                      className={styles.formInput}
                      placeholder="Country"
                      value={formData.country}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          country: event.target.value,
                        }))
                      }
                    />
                  </label>
                  <label className={styles.formField}>
                    <span className={styles.formLabel}>Postal Code</span>
                    <input
                      className={styles.formInput}
                      placeholder="Postal Code"
                      value={formData.postalCode}
                      onChange={(event) =>
                        setFormData((prev) => ({
                          ...prev,
                          postalCode: event.target.value,
                        }))
                      }
                    />
                  </label>
                </div>
                <label className={styles.formField}>
                  <span className={styles.formLabel}>Phone Number</span>
                  <input
                    className={styles.formInput}
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className={styles.formField}>
                  <span className={styles.formLabel}>Email</span>
                  <input
                    className={styles.formInput}
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: event.target.value,
                      }))
                    }
                  />
                </label>
                <label className={styles.formField}>
                  <span className={styles.formLabel}>
                    Description (Optional)
                  </span>
                  <textarea
                    className={styles.formTextarea}
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: event.target.value,
                      }))
                    }
                  />
                </label>
              </div>
              <div className={styles.formActions}>
                <button
                  className={styles.cancelButton}
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className={styles.saveButton}
                  type="button"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </section>
          )}
        </main>
        <footer className={styles.dashboardFooter} />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>Video Analytics</div>
      </header>
      <main className={styles.content}>
        <section className={styles.card}>
          <h1 className={styles.title}>Sign-in</h1>
          <form className={styles.form}>
            <label className={styles.field}>
              <span className={styles.label}>Email</span>
              <input
                className={styles.input}
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span className={styles.label}>Password</span>
              <div className={styles.inputWrapper}>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <span className={styles.icon} aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 12c1.9-4 5.6-6 9-6s7.1 2 9 6c-1.9 4-5.6 6-9 6s-7.1-2-9-6Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3.2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M4 4l16 16"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </span>
              </div>
            </label>
            <button className={styles.button} type="button" onClick={handleLogin}>
              Login
            </button>
            {error ? <p className={styles.error}>{error}</p> : null}
            <a className={styles.forgot} href="#">
              Forgot Password?
            </a>
          </form>
        </section>
      </main>
      <footer className={styles.footer}>Powered by Cognitivebotics</footer>
    </div>
  );
}
