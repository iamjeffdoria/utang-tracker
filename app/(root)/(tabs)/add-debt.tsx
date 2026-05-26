import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useEffect, useState } from 'react'
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Toast from 'react-native-toast-message'
import { useContacts } from '../../../hooks/useContacts'
import { useDebts } from '../../../hooks/useDebts'

export default function AddDebt() {
  const { contactList, fetchContacts } = useContacts()
  const { debtList, fetchDebts, addDebt, deleteDebt, updateDebt, markAsPaid, markAsUnpaid} = useDebts()

// Modal visibility
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [contactModalVisible, setContactModalVisible] = useState(false)

  // Form state (shared between add and edit)
  const [isLender, setIsLender] = useState(true)
  const [selectedContact, setSelectedContact] = useState<typeof contactList[0] | null>(null)
  const [contactSearch, setContactSearch] = useState('')
  const [amount, setAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit state
  const [editingDebt, setEditingDebt] = useState<typeof debtList[0] | null>(null)
  const [updating, setUpdating] = useState(false)

  // List filter
  const [listSearch, setListSearch] = useState('')

  useEffect(() => {
    fetchContacts()
    fetchDebts()
  }, [])

  const filteredContacts = [...contactList]
    .filter((c) =>
      `${c.fullName} ${c.lastName ?? ''}`
        .toLowerCase()
        .includes(contactSearch.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const filteredDebts = [...debtList]
    .filter((d) => {
      const contact = contactList.find((c) => c.id === d.contactId)
      const name = contact ? `${contact.fullName} ${contact.lastName ?? ''}` : ''
      return name.toLowerCase().includes(listSearch.toLowerCase())
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const formattedDate = dueDate
    ? dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  const resetForm = () => {
    setSelectedContact(null)
    setAmount('')
    setNotes('')
    setDueDate(null)
    setIsLender(true)
    setContactSearch('')
  }

  const handleSave = async () => {
    if (!selectedContact || !amount.trim()) return
    setSaving(true)
    const contactName = selectedContact.fullName
    await addDebt({
      contactId: selectedContact.id,
      amount: parseFloat(amount).toFixed(2),
      type: isLender ? 'lender' : 'borrower',
      notes: notes.trim() || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    })
    setSaving(false)
    setAddModalVisible(false)
    resetForm()
    Toast.show({
      type: 'success',
      text1: 'Debt Saved ✅',
      text2: `Debt for ${contactName} was recorded.`,
      visibilityTime: 3000,
    })
  }

  const getContactName = (contactId: string) => {
    const c = contactList.find((c) => c.id === contactId)
    return c ? `${c.fullName} ${c.lastName ?? ''}`.trim() : 'Unknown'
  }

  const getContactInitial = (contactId: string) => {
      const c = contactList.find((c) => c.id === contactId)
      return c ? c.fullName.charAt(0).toUpperCase() : '?'
    }

    const handleOpenEdit = (debt: typeof debtList[0]) => {
    setEditingDebt(debt)
    setIsLender(debt.type === 'lender')
    setAmount(debt.amount)
    setNotes(debt.notes ?? '')
    setDueDate(debt.dueDate ? new Date(debt.dueDate) : null)
    const contact = contactList.find((c) => c.id === debt.contactId) ?? null
    setSelectedContact(contact)
    setEditModalVisible(true)
  }

  const handleUpdateDebt = async () => {
    if (!selectedContact || !amount.trim() || !editingDebt) return
    setUpdating(true)
    await updateDebt(editingDebt.id, {
      contactId: selectedContact.id,
      amount: parseFloat(amount).toFixed(2),
      type: isLender ? 'lender' : 'borrower',
      notes: notes.trim() || undefined,
      dueDate: dueDate ? dueDate.toISOString() : undefined,
    })
    setUpdating(false)
    setEditModalVisible(false)
    setEditingDebt(null)
    resetForm()
    Toast.show({
      type: 'success',
      text1: 'Debt Updated ✅',
      text2: `Debt for ${selectedContact.fullName} was updated.`,
      visibilityTime: 3000,
    })
  }

 

    const handleDeleteDebt = (id: string, contactId: string) => {
      Alert.alert(
        'Delete Debt',
        `Are you sure you want to delete this debt for ${getContactName(contactId)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteDebt(id)
              Toast.show({
                type: 'success',
                text1: 'Debt Deleted 🗑️',
                text2: `Debt for ${getContactName(contactId)} was removed.`,
                visibilityTime: 3000,
              })
            },
          },
        ]
      )
    }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View className="items-center mb-6">
          <View className="flex-row items-center gap-2">
            <Ionicons name="receipt-outline" size={22} color="#1e293b" />
            <Text className="text-slate-800 text-2xl font-extrabold tracking-tight">
              Debt Records
            </Text>
          </View>
          <Text className="text-slate-400 text-xs mt-1">
            Track what you owe and what's owed to you
          </Text>
        </View>
      <View className="flex-row gap-4 mb-7">
          <View className="flex-1 bg-red-500 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-red-100 text-sm">I Owe</Text>
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
            <Text className="text-red-200 text-xs mt-1">
              {debtList.filter((d) => d.type === 'borrower' && d.status === 'unpaid').length} unpaid debt{debtList.filter((d) => d.type === 'borrower' && d.status === 'unpaid').length !== 1 ? 's' : ''}
            </Text>
          </View>
          <View className="flex-1 bg-green-500 rounded-2xl p-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-green-100 text-sm">Owed to Me</Text>
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
            <Text className="text-green-200 text-xs mt-1">
              {debtList.filter((d) => d.type === 'lender' && d.status === 'unpaid').length} unpaid debt{debtList.filter((d) => d.type === 'lender' && d.status === 'unpaid').length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>

      {/* Debt List Container */}
      <View className="bg-white border border-slate-200 rounded-3xl p-4 mb-6">

        {/* List Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-slate-700 text-lg font-bold">Debts</Text>
            <View className="flex-row items-center gap-1 mt-0.5">
              <View className="bg-green-100 rounded-full px-2 py-0.5">
                <Text className="text-green-600 text-xs font-bold">{debtList.length}</Text>
              </View>
              <Text className="text-slate-400 text-xs">total records</Text>
            </View>
          </View>
          <TouchableOpacity
            className="flex-row items-center bg-green-500 rounded-2xl px-4 py-2 gap-1"
            onPress={() => setAddModalVisible(true)}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="white" />
            <Text className="text-white text-sm font-bold">Add Debt</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            className="flex-1 ml-2 text-slate-800 text-sm"
            placeholder="Search by contact name..."
            placeholderTextColor="#94A3B8"
            value={listSearch}
            onChangeText={setListSearch}
          />
        </View>

        {/* Debt List */}
        <ScrollView
          className="max-h-80"
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={true}
        >
        <View className="gap-3">
          {debtList.length === 0 ? (
              <View className="bg-slate-50 rounded-2xl p-6 items-center">
                <Ionicons name="receipt-outline" size={32} color="#CBD5E1" />
                <Text className="text-slate-400 text-sm mt-2">No debts yet. Add one!</Text>
              </View>
            ) : filteredDebts.length === 0 ? (
              <View className="bg-slate-50 rounded-2xl p-6 items-center">
                <Ionicons name="search-outline" size={32} color="#CBD5E1" />
                <Text className="text-slate-500 text-sm font-semibold mt-2">No matching debts</Text>
                <Text className="text-slate-400 text-xs mt-1 text-center">
                  Try searching with a different name.
                </Text>
              </View>
            ) : (
              filteredDebts.map((d) => (
                <View
                  key={d.id}
                  className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex-row items-center gap-3"
                >
                  {/* Avatar */}
                  <View className={`w-10 h-10 rounded-full items-center justify-center border ${
                    d.type === 'lender'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <Text className={`font-bold text-sm ${
                      d.type === 'lender' ? 'text-green-600' : 'text-red-500'
                    }`}>
                      {getContactInitial(d.contactId)}
                    </Text>
                  </View>

                  {/* Info */}
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between">
                      <Text className="text-slate-800 text-sm font-bold">
                        {getContactName(d.contactId)}
                      </Text>
                      <View className="flex-row items-center gap-2">
                        <Text className={`text-sm font-extrabold ${
                          d.type === 'lender' ? 'text-green-500' : 'text-red-500'
                        }`}>
                          {d.type === 'lender' ? '+' : '-'}₱{parseFloat(d.amount).toFixed(2)}
                        </Text>
                      <TouchableOpacity
                      onPress={() => {
                        const isPaid = d.status === 'paid'
                        Alert.alert(
                          isPaid ? 'Mark as Unpaid' : 'Mark as Paid',
                          isPaid
                            ? `Revert this debt for ${getContactName(d.contactId)} back to unpaid?`
                            : `Mark this debt for ${getContactName(d.contactId)} as paid?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            {
                              text: isPaid ? 'Mark Unpaid' : 'Mark Paid',
                              onPress: async () => {
                                if (isPaid) {
                                  await markAsUnpaid(d.id)
                                  Toast.show({
                                    type: 'info',
                                    text1: 'Marked as Unpaid 🔄',
                                    text2: `Debt for ${getContactName(d.contactId)} is now unpaid.`,
                                    visibilityTime: 3000,
                                  })
                                } else {
                                  await markAsPaid(d.id)
                                  Toast.show({
                                    type: 'success',
                                    text1: 'Marked as Paid ✅',
                                    text2: `Debt for ${getContactName(d.contactId)} is now settled.`,
                                    visibilityTime: 3000,
                                  })
                                }
                              },
                            },
                          ]
                        )
                      }}
                      className={`border rounded-xl p-1.5 ${
                        d.status === 'paid'
                          ? 'bg-yellow-50 border-yellow-100'
                          : 'bg-green-50 border-green-100'
                      }`}
                    >
                      <Ionicons
                        name={d.status === 'paid' ? 'refresh-outline' : 'checkmark-outline'}
                        size={14}
                        color={d.status === 'paid' ? '#EAB308' : '#22c55e'}
                      />
                    </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenEdit(d)}
                className="bg-blue-50 border border-blue-100 rounded-xl p-1.5"
              >
                <Ionicons name="pencil-outline" size={14} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDeleteDebt(d.id, d.contactId)}
                className="bg-red-50 border border-red-100 rounded-xl p-1.5"
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
              </TouchableOpacity>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between mt-1">
                      <Text className="text-slate-400 text-xs">
                        {d.type === 'lender' ? 'They owe me' : 'I owe them'}
                      </Text>
                      <View className={`rounded-full px-2 py-0.5 ${
                        d.status === 'paid' ? 'bg-slate-100' : 'bg-yellow-50'
                      }`}>
                        <Text className={`text-xs font-semibold ${
                          d.status === 'paid' ? 'text-slate-400' : 'text-yellow-600'
                        }`}>
                          {d.status === 'paid' ? 'Paid' : 'Unpaid'}
                        </Text>
                      </View>
                    </View>

                    {d.dueDate && (
                      <Text className="text-slate-400 text-xs mt-1">
                        Due {new Date(d.dueDate).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric'
                        })}
                      </Text>
                    )}

                    {d.notes && (
                      <Text className="text-slate-400 text-xs mt-1 italic" numberOfLines={1}>
                        {d.notes}
                      </Text>
                    )}
                  </View>
                </View>
              ))
)}
          </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* ── Add Debt Modal ── */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setAddModalVisible(false); resetForm() }}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10" style={{ maxHeight: '90%' }}>

            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-slate-800 text-lg font-extrabold">New Debt</Text>
              <TouchableOpacity onPress={() => { setAddModalVisible(false); resetForm() }}>
                <Ionicons name="close-circle" size={26} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View className="gap-y-5">

                {/* Lender Toggle */}
                <View className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200">
                  <View>
                    <Text className="text-slate-800 text-sm font-semibold">
                      {isLender ? 'I am the Lender' : 'I am the Borrower'}
                    </Text>
                    <Text className="text-slate-400 text-xs mt-0.5">
                      {isLender ? 'They owe me money' : 'I owe them money'}
                    </Text>
                  </View>
                  <Switch
                    value={isLender}
                    onValueChange={setIsLender}
                    trackColor={{ false: '#EF4444', true: '#22c55e' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Contact Picker */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Contact
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200"
                    onPress={() => setContactModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="person-outline" size={16} color="#22c55e" />
                      {selectedContact ? (
                        <Text className="text-slate-800 text-sm font-semibold">
                          {selectedContact.fullName} {selectedContact.lastName ?? ''}
                        </Text>
                      ) : (
                        <Text className="text-slate-400 text-sm">Select a contact...</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Amount */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Amount
                  </Text>
                  <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 border border-slate-200">
                    <Text className="text-green-500 text-sm font-bold mr-1">₱</Text>
                    <TextInput
                      className="flex-1 text-slate-800 text-sm font-semibold py-4"
                      placeholder="0.00"
                      placeholderTextColor="#94A3B8"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* Due Date */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Due Date
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200"
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text className={formattedDate ? 'text-slate-800 text-sm' : 'text-slate-400 text-sm'}>
                      {formattedDate ?? 'Select due date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    themeVariant="light"
                    onChange={(_, date) => {
                      setShowDatePicker(false)
                      if (date) setDueDate(date)
                    }}
                  />
                )}

                {/* Notes */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Notes
                  </Text>
                  <TextInput
                    className="bg-slate-50 rounded-2xl px-4 py-4 text-slate-800 text-sm border border-slate-200"
                    placeholder="Add a note..."
                    placeholderTextColor="#94A3B8"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    style={{ minHeight: 80 }}
                  />
                </View>

                {/* Save Button */}
                <TouchableOpacity
                  className={`rounded-2xl py-4 items-center ${
                    !selectedContact || !amount.trim() || saving
                      ? 'bg-slate-200'
                      : 'bg-green-500'
                  }`}
                  onPress={handleSave}
                  disabled={!selectedContact || !amount.trim() || saving}
                  activeOpacity={0.85}
                >
                  <Text className={`text-base font-extrabold ${
                    !selectedContact || !amount.trim() || saving
                      ? 'text-slate-400'
                      : 'text-white'
                  }`}>
                    {saving ? 'Saving...' : 'Save Debt'}
                  </Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Contact Picker Modal ── */}
      <Modal
        visible={contactModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10" style={{ maxHeight: '75%' }}>

            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-slate-800 text-lg font-extrabold">Select Contact</Text>
              <TouchableOpacity onPress={() => setContactModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center bg-slate-100 border border-slate-200 rounded-2xl px-4 py-3 mb-4">
              <Ionicons name="search" size={18} color="#94A3B8" />
              <TextInput
                className="flex-1 ml-2 text-slate-800 text-sm"
                placeholder="Search contacts..."
                placeholderTextColor="#94A3B8"
                value={contactSearch}
                onChangeText={setContactSearch}
              />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View className="gap-3">
                {filteredContacts.length === 0 ? (
                  <View className="items-center py-8">
                    <Ionicons name="people-outline" size={32} color="#CBD5E1" />
                    <Text className="text-slate-400 text-sm mt-2">No contacts found.</Text>
                  </View>
                ) : (
                  filteredContacts.map((c) => (
                    <TouchableOpacity
                      key={c.id}
                      className={`flex-row items-center gap-3 p-4 rounded-2xl border ${
                        selectedContact?.id === c.id
                          ? 'bg-green-50 border-green-200'
                          : 'bg-slate-50 border-slate-100'
                      }`}
                      onPress={() => {
                        setSelectedContact(c)
                        setContactModalVisible(false)
                        setContactSearch('')
                      }}
                      activeOpacity={0.8}
                    >
                      <View className="w-10 h-10 rounded-full bg-green-50 border border-green-200 items-center justify-center">
                        <Text className="text-green-600 font-bold text-sm">
                          {c.fullName.charAt(0).toUpperCase()}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-800 text-sm font-bold">
                          {c.fullName} {c.lastName ?? ''}
                        </Text>
                        <Text className="text-slate-400 text-xs mt-0.5">
                          Added {new Date(c.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </Text>
                      </View>
                      {selectedContact?.id === c.id && (
                        <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                      )}
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

            {/* ── Edit Debt Modal ── */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => { setEditModalVisible(false); setEditingDebt(null); resetForm() }}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-10" style={{ maxHeight: '90%' }}>

            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-slate-800 text-lg font-extrabold">Edit Debt</Text>
              <TouchableOpacity onPress={() => { setEditModalVisible(false); setEditingDebt(null); resetForm() }}>
                <Ionicons name="close-circle" size={26} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View className="gap-y-5">

                {/* Lender Toggle */}
                <View className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-5 py-4 border border-slate-200">
                  <View>
                    <Text className="text-slate-800 text-sm font-semibold">
                      {isLender ? 'I am the Lender' : 'I am the Borrower'}
                    </Text>
                    <Text className="text-slate-400 text-xs mt-0.5">
                      {isLender ? 'They owe me money' : 'I owe them money'}
                    </Text>
                  </View>
                  <Switch
                    value={isLender}
                    onValueChange={setIsLender}
                    trackColor={{ false: '#EF4444', true: '#22c55e' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Contact Picker */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Contact
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200"
                    onPress={() => setContactModalVisible(true)}
                    activeOpacity={0.8}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons name="person-outline" size={16} color="#22c55e" />
                      {selectedContact ? (
                        <Text className="text-slate-800 text-sm font-semibold">
                          {selectedContact.fullName} {selectedContact.lastName ?? ''}
                        </Text>
                      ) : (
                        <Text className="text-slate-400 text-sm">Select a contact...</Text>
                      )}
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {/* Amount */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Amount
                  </Text>
                  <View className="flex-row items-center bg-slate-50 rounded-2xl px-4 border border-slate-200">
                    <Text className="text-green-500 text-sm font-bold mr-1">₱</Text>
                    <TextInput
                      className="flex-1 text-slate-800 text-sm font-semibold py-4"
                      placeholder="0.00"
                      placeholderTextColor="#94A3B8"
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* Due Date */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Due Date
                  </Text>
                  <TouchableOpacity
                    className="flex-row items-center justify-between bg-slate-50 rounded-2xl px-4 py-4 border border-slate-200"
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                  >
                    <Text className={formattedDate ? 'text-slate-800 text-sm' : 'text-slate-400 text-sm'}>
                      {formattedDate ?? 'Select due date'}
                    </Text>
                    <Ionicons name="calendar-outline" size={16} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                {showDatePicker && (
                  <DateTimePicker
                    value={dueDate ?? new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    minimumDate={new Date()}
                    themeVariant="light"
                    onChange={(_, date) => {
                      setShowDatePicker(false)
                      if (date) setDueDate(date)
                    }}
                  />
                )}

                {/* Notes */}
                <View className="gap-y-2">
                  <Text className="text-slate-400 text-xs font-semibold uppercase tracking-widest ml-1">
                    Notes
                  </Text>
                  <TextInput
                    className="bg-slate-50 rounded-2xl px-4 py-4 text-slate-800 text-sm border border-slate-200"
                    placeholder="Add a note..."
                    placeholderTextColor="#94A3B8"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    style={{ minHeight: 80 }}
                  />
                </View>

                {/* Update Button */}
                <TouchableOpacity
                  className={`rounded-2xl py-4 items-center ${
                    !selectedContact || !amount.trim() || updating
                      ? 'bg-slate-200'
                      : 'bg-blue-500'
                  }`}
                  onPress={handleUpdateDebt}
                  disabled={!selectedContact || !amount.trim() || updating}
                  activeOpacity={0.85}
                >
                  <Text className={`text-base font-extrabold ${
                    !selectedContact || !amount.trim() || updating
                      ? 'text-slate-400'
                      : 'text-white'
                  }`}>
                    {updating ? 'Updating...' : 'Update Debt'}
                  </Text>
                </TouchableOpacity>

              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}