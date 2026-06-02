import { Tabs, useRouter } from "expo-router";
import { BarChart2, Bell, House, Plus, Receipt, User, UserPlus, Wallet } from "lucide-react-native";
import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useContacts } from "../../../hooks/useContacts";
import { useNotifications } from "../../../hooks/useNotifications";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { addContact } = useContacts();
  const { addNotification, notificationList, fetchNotifications } = useNotifications();

  const unreadCount = notificationList.filter(n => n.read === 'false').length;

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10_000);
    return () => clearInterval(interval);
  }, []);

  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [addContactVisible, setAddContactVisible] = useState(false);
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSaveContact = async () => {
    if (!fullName.trim()) return;
    setSaving(true);
    await addContact(fullName.trim(), lastName.trim() || undefined);
    await addNotification({
      type: "new",
      title: "Contact Added",
      message: `${fullName.trim()}${lastName.trim() ? " " + lastName.trim() : ""} was added to your contacts.`,
    });
    setSaving(false);
    setAddContactVisible(false);
    setFullName("");
    setLastName("");
    Toast.show({
      type: "success",
      text1: "Contact Added ✅",
      text2: `${fullName} was added to your contacts.`,
      visibilityTime: 3000,
    });
  };

  const actions = [
    {
      icon: Receipt,
      label: "Add Debt",
      description: "Record a new debt",
      color: "#22c55e",
      borderColor: "#bbf7d0",
      bgColor: "#f0fdf4",
      onPress: () => {
        setActionSheetVisible(false);
        router.push("/add-debt");
      },
    },
    {
      icon: UserPlus,
      label: "Add Contact",
      description: "Add someone to your list",
      color: "#3b82f6",
      borderColor: "#bfdbfe",
      bgColor: "#eff6ff",
      onPress: () => {
        setActionSheetVisible(false);
        setAddContactVisible(true);
      },
    },
    {
      icon: BarChart2,
      label: "View Summary",
      description: "See your debt overview",
      color: "#f59e0b",
      borderColor: "#fde68a",
      bgColor: "#fffbeb",
      onPress: () => {
        setActionSheetVisible(false);
        router.push("/");
      },
    },
  ];

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e2e8f0",
            height: 64 + insets.bottom,
            paddingTop: 8,
            paddingBottom: insets.bottom,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 12,
          },
          tabBarActiveTintColor: "#22c55e",
          tabBarInactiveTintColor: "#94a3b8",
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="add-debt"
          options={{
            title: "Add Debt",
            tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="add-shortcut"
          options={{
            title: "",
            tabBarButton: () => (
              <TouchableOpacity
                onPress={() => setActionSheetVisible(true)}
                activeOpacity={0.85}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
              >
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: "#22c55e",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                    shadowColor: "#16a34a",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                >
                  <Plus color="white" size={28} strokeWidth={3} />
                </View>
              </TouchableOpacity>
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: "Notifications",
            tabBarIcon: ({ color, size }) => <Bell color={color} size={size} />,
            tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: '#ef4444',
              color: 'white',
              fontSize: 10,
              fontWeight: '700',
              minWidth: 16,
              height: 16,
              lineHeight: 16,
              borderRadius: 8,
            },
          }}
        />
                <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>

      {/* Quick Action Sheet */}
      <Modal
        visible={actionSheetVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setActionSheetVisible(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          activeOpacity={1}
          onPress={() => setActionSheetVisible(false)}
        />
        <View
          style={{
            backgroundColor: "white",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingHorizontal: 24,
            paddingTop: 24,
            paddingBottom: 24 + insets.bottom,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#e2e8f0",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View>
              <Text style={{ color: "#1e293b", fontSize: 18, fontWeight: "800" }}>
                Quick Actions
              </Text>
              <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                What would you like to do?
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setActionSheetVisible(false)}
              style={{ backgroundColor: "#f1f5f9", borderRadius: 999, padding: 8 }}
            >
              <Plus
                color="#94a3b8"
                size={18}
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ gap: 12 }}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                activeOpacity={0.8}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 16,
                  padding: 16,
                  borderRadius: 16,
                  backgroundColor: action.bgColor,
                  borderWidth: 1,
                  borderColor: action.borderColor,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: action.color + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <action.icon color={action.color} size={22} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: "#1e293b", fontSize: 14, fontWeight: "700" }}>
                    {action.label}
                  </Text>
                  <Text style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
                    {action.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        visible={addContactVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setAddContactVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 24,
              paddingTop: 24,
              paddingBottom: 24 + insets.bottom,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: "#e2e8f0",
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 24,
              }}
            >
              <Text style={{ color: "#1e293b", fontSize: 18, fontWeight: "800" }}>
                New Contact
              </Text>
              <TouchableOpacity
                onPress={() => setAddContactVisible(false)}
                style={{ backgroundColor: "#f1f5f9", borderRadius: 999, padding: 8 }}
              >
                <Plus
                  color="#94a3b8"
                  size={18}
                  style={{ transform: [{ rotate: "45deg" }] }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginLeft: 4,
                marginBottom: 8,
              }}
            >
              First Name
            </Text>
            <TextInput
              style={{
                backgroundColor: "#f8fafc",
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: "#1e293b",
                fontSize: 14,
                marginBottom: 16,
              }}
              placeholder="e.g. Juan"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
            />
            <Text
              style={{
                color: "#94a3b8",
                fontSize: 11,
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginLeft: 4,
                marginBottom: 8,
              }}
            >
              Last Name (optional)
            </Text>
            <TextInput
              style={{
                backgroundColor: "#f8fafc",
                borderWidth: 1,
                borderColor: "#e2e8f0",
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: "#1e293b",
                fontSize: 14,
                marginBottom: 24,
              }}
              placeholder="e.g. dela Cruz"
              placeholderTextColor="#94a3b8"
              value={lastName}
              onChangeText={setLastName}
            />
            <TouchableOpacity
              onPress={handleSaveContact}
              disabled={!fullName.trim() || saving}
              activeOpacity={0.85}
              style={{
                backgroundColor: !fullName.trim() || saving ? "#e2e8f0" : "#22c55e",
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: !fullName.trim() || saving ? "#94a3b8" : "white",
                  fontSize: 16,
                  fontWeight: "800",
                }}
              >
                {saving ? "Saving..." : "Save Contact"}
              </Text>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}