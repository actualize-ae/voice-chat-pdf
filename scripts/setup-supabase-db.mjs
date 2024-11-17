

export const createSupabaseDatabase = async (supabase, {
  rpcName,
  databaseTableName,
}) => {
  try {
    const { data, error } = await supabase.rpc(rpcName, {
      table_name: databaseTableName
    })
    if (error) throw error
    console.log(`rpc ${rpcName} executed successfully`, data)
  } catch (error) {
    console.error('Error while executing rpc:', error)
  }
}