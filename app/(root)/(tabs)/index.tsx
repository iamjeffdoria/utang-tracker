import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useContacts } from '../../../hooks/useContacts'
import { useDebts } from '../../../hooks/useDebts'

export default function HomeScreen() {
  const { contactList, fetchContacts, addContact, deleteContact, updateContact } = useContacts()
  const { debtList, fetchDebts } = useDebts()
  const [modalVisible, setModalVisible] = useState(false)
  const [fullName, setFullName] = useState('')
  const [lastName, setLastName] = useState('')
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // NEW
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [editingContact, setEditingContact] = useState<typeof contactList[0] | null>(null)
  const [editFullName, setEditFullName] = useState('')
  const [editLastName, setEditLastName] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchContacts()
    fetchDebts()
  }, [])

  const handleAddContact = async () => {
    if (!fullName.trim()) return
    setSaving(true)
    await addContact(fullName.trim(), lastName.trim() || undefined)
    setFullName('')
    setLastName('')
    setSaving(false)
    setModalVisible(false)
    Toast.show({
      type: 'success',
      text1: 'Contact Added ✅',
      text2: `${fullName} was added to your contacts.`,
      visibilityTime: 3000,
    })
  }

  const handleDeleteContact = (id: string, name: string) => {
  Alert.alert(
    'Delete Contact',
    `Are you sure you want to delete ${name}?`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteContact(id)

          Toast.show({
            type: 'success',
            text1: 'Contact Deleted 🗑️',
            text2: `${name} was removed.`,
            visibilityTime: 3000,
          })
        },
      },
    ]
  )
}

const handleOpenEdit = (contact: typeof contactList[0]) => {
  setEditingContact(contact)
  setEditFullName(contact.fullName)
  setEditLastName(contact.lastName ?? '')
  setEditModalVisible(true)
}

const handleUpdateContact = async () => {
  if (!editFullName.trim() || !editingContact) return
  setUpdating(true)
  await updateContact(editingContact.id, editFullName.trim(), editLastName.trim() || undefined)
  setUpdating(false)
  setEditModalVisible(false)
  setEditingContact(null)
  Toast.show({
    type: 'success',
    text1: 'Contact Updated ✅',
    text2: `${editFullName} was updated.`,
    visibilityTime: 3000,
  })
}

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>

        {/* Title */}
      <View className="items-center mb-6">
        <View className="flex-row items-center gap-2">
          <Ionicons name="wallet-outline" size={22} color="#1e293b" />
          <Text className="text-slate-800 text-2xl font-extrabold tracking-tight">
            Your Debt Summary
          </Text>
        </View>
        <Text className="text-slate-400 text-xs mt-1">
          Stay on top of your finances
        </Text>
      </View>

        {/* Overview */}
        <Text className="text-slate-700 text-lg font-bold mb-3">Overview</Text>
        <View className="flex-row gap-4 mb-7">
        <View className="flex-1 bg-red-500 rounded-2xl p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-red-100 text-sm">You Owe</Text>
            <View className="bg-red-400 rounded-full p-1.5">
              <Ionicons name="arrow-up-outline" size={14} color="white" />
            </View>
          </View>
          <Text className="text-white text-xl font-extrabold">
            ₱{debtList
              .filter((d) => d.type === 'borrower' && d.status === 'unpaid')
              .reduce((sum, d) => sum + parseFloat(d.amount), 0)
              .toFixed(2)}
          </Text>
          <Text className="text-red-200 text-xs mt-1">Outstanding balance</Text>
        </View>
        <View className="flex-1 bg-green-500 rounded-2xl p-4">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-green-100 text-sm">You are Owed</Text>
            <View className="bg-green-400 rounded-full p-1.5">
              <Ionicons name="arrow-down-outline" size={14} color="white" />
            </View>
          </View>
          <Text className="text-white text-xl font-extrabold">
            ₱{debtList
              .filter((d) => d.type === 'lender' && d.status === 'unpaid')
              .reduce((sum, d) => sum + parseFloat(d.amount), 0)
              .toFixed(2)}
          </Text>
          <Text className="text-green-200 text-xs mt-1">Pending collection</Text>
        </View>
      </View>

      {/* Contacts Section Container */}
      <View className="bg-white border border-slate-200 rounded-3xl p-4 mb-6">

        {/* Contacts Header */}
       <View className="flex-row items-center justify-between mb-4">

        {/* Left Side */}
        <View>
          <Text className="text-slate-700 text-lg font-bold">
            Contacts
          </Text>

         <View className="flex-row items-center gap-1 mt-0.5">
          <View className="bg-green-100 rounded-full px-2 py-0.5">
            <Text className="text-green-600 text-xs font-bold">
              {contactList.length}
            </Text>
          </View>
          <Text className="text-slate-400 text-xs">
            total contacts
          </Text>
        </View>
        </View>

        {/* Add Button */}
        <TouchableOpacity
          className="flex-row items-center bg-green-500 rounded-2xl px-4 py-2 gap-1"
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="white" />

          <Text className="text-white text-sm font-bold">
            Add Contact
          </Text>
        </TouchableOpacity>

      </View>

      {/* Search Bar */}
      <View className="flex-row items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
        <Ionicons
          name="search"
          size={18}
          color="#94A3B8"
        />

        <TextInput
          className="flex-1 ml-2 text-slate-800 text-sm"
          placeholder="Search contacts..."
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Contacts List */}
      <ScrollView
          className="max-h-80"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
        <View className="gap-3">
        {contactList.length === 0 ? (

  /* No Contacts Yet */
  <View className="bg-slate-50 rounded-2xl p-6 items-center">
    <Ionicons
      name="people-outline"
      size={32}
      color="#CBD5E1"
    />

    <Text className="text-slate-400 text-sm mt-2">
      No contacts yet. Add one!
    </Text>
  </View>

) : [...contactList]
    .filter((c) =>
      `${c.fullName} ${c.lastName ?? ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ).length === 0 ? (

  /* Search Not Found */
  <View className="bg-slate-50 rounded-2xl p-6 items-center">
    <Ionicons
      name="search-outline"
      size={32}
      color="#CBD5E1"
    />

    <Text className="text-slate-500 text-sm font-semibold mt-2">
      No matching contacts
    </Text>

    <Text className="text-slate-400 text-xs mt-1 text-center">
      Try searching with a different name.
    </Text>
  </View>

    ) : (

      /* Contact Results */
      [...contactList]
          .filter((c) =>
            `${c.fullName} ${c.lastName ?? ''}`
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((c) => (
          <View
            key={c.id}
            className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row items-center gap-3"
          >
            <View className="w-10 h-10 rounded-full bg-green-50 border border-green-200 items-center justify-center">
              <Text className="text-green-600 font-bold text-sm">
                {c.fullName.charAt(0).toUpperCase()}
              </Text>
            </View>

           <View className="flex-1 flex-row items-center justify-between">

              {/* Left Side */}
              <View>
                <Text className="text-slate-800 text-base font-bold">
                  {c.fullName} {c.lastName ?? ''}
                </Text>

                <Text className="text-slate-400 text-xs mt-0.5">
                  Added{' '}
                  {new Date(c.createdAt).toLocaleDateString(
                    'en-US',
                    {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }
                  )}
                </Text>
              </View>

             {/* Action Buttons */}
              <View className="flex-row items-center">

                {/* Edit Button */}
                <TouchableOpacity
                  onPress={() => handleOpenEdit(c)}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-2 mr-2"
                >
                  <Ionicons name="pencil-outline" size={18} color="#3B82F6" />
                </TouchableOpacity>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() =>
                    handleDeleteContact(
                      c.id,
                      `${c.fullName} ${c.lastName ?? ''}`
                    )
                  }
                  className="bg-red-50 border border-red-100 rounded-xl p-2"
                >
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                </TouchableOpacity>

              </View>

            </View>
          </View>
        ))
    )}
      </View>
      </ScrollView>
      </View>

      </ScrollView>

      {/* Add Contact Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">

            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-slate-800 text-lg font-extrabold">New Contact</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            {/* First Name */}
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1 mb-2">
              First Name
            </Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 text-sm mb-4"
              placeholder="e.g. Juan"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />

            {/* Last Name */}
            <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1 mb-2">
              Last Name (optional)
            </Text>
            <TextInput
              className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 text-sm mb-6"
              placeholder="e.g. dela Cruz"
              placeholderTextColor="#94A3B8"
              value={lastName}
              onChangeText={setLastName}
            />

            {/* Save Button */}
            <TouchableOpacity
              className={`bg-green-500 rounded-2xl py-4 items-center ${saving ? 'opacity-70' : 'opacity-100'}`}
              onPress={handleAddContact}
              disabled={saving}
              activeOpacity={0.85}
            >
              <Text className="text-white font-extrabold text-base">
                {saving ? 'Saving...' : 'Save Contact'}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* Edit Contact Modal */}
<Modal
  visible={editModalVisible}
  animationType="slide"
  transparent
  onRequestClose={() => setEditModalVisible(false)}
>
  <View className="flex-1 justify-end bg-black/40">
    <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10">

      {/* Modal Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-slate-800 text-lg font-extrabold">Edit Contact</Text>
        <TouchableOpacity onPress={() => setEditModalVisible(false)}>
          <Ionicons name="close-circle" size={26} color="#CBD5E1" />
        </TouchableOpacity>
      </View>

      {/* First Name */}
      <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1 mb-2">
        First Name
      </Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 text-sm mb-4"
        placeholder="e.g. Juan"
        placeholderTextColor="#94A3B8"
        value={editFullName}
        onChangeText={setEditFullName}
      />

      {/* Last Name */}
      <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1 mb-2">
        Last Name (optional)
      </Text>
      <TextInput
        className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-4 text-slate-800 text-sm mb-6"
        placeholder="e.g. dela Cruz"
        placeholderTextColor="#94A3B8"
        value={editLastName}
        onChangeText={setEditLastName}
      />

      {/* Update Button */}
      <TouchableOpacity
        className={`bg-blue-500 rounded-2xl py-4 items-center ${updating ? 'opacity-70' : 'opacity-100'}`}
        onPress={handleUpdateContact}
        disabled={updating}
        activeOpacity={0.85}
      >
        <Text className="text-white font-extrabold text-base">
          {updating ? 'Updating...' : 'Update Contact'}
        </Text>
      </TouchableOpacity>

    </View>
  </View>
</Modal>

    </SafeAreaView>
  )
}