# CRUD: one and many

Files: `db/crud.ts` (generic helpers), `db/repositories/messages.repo.ts`, `db/repositories/chats.repo.ts`.

| | ONE | MANY |
|---|---|---|
| **Create** | `insertOne(table, row)` | `insertMany(table, rows)` (1 transaction + prepared statement) |
| **Create or update** | `upsertOne(table, row, { conflict })` | `upsertMany(table, rows, { conflict })` |
| **Read** | `findOne(table, where)` | `findMany(table, { where, orderBy, limit })` |
| **Update** | `updateOne(table, set, where)` | `updateWhere(table, set, where)` same values; `updateEach(table, rows, { key })` different values |
| **Delete** | `deleteOne(table, where)` | `deleteWhere(table, where)`; `deleteByIds(table, col, ids)` |

## Examples
```ts
// create
await insertOne("users", { id: "u1", display_name: "Ali", updated_at: Date.now() });
await insertMany("contacts", rows, { orIgnore: true });

// read
const ali = await findOne("users", { id: "u1" });
const unread = await findMany("messages", { where: { chat_id, status: ["sent", "delivered"] }, orderBy: "created_at DESC", limit: 50 });
const old = await findMany("messages", { where: { chat_id }, extra: { sql: "created_at < ?", params: [cursor] } });

// update
await updateOne("users", { display_name: "Ali K" }, { id: "u1" });
await updateWhere("chats", { is_archived: 1 }, { id: ["c1", "c2", "c3"] });

// delete
await deleteOne("users", { id: "u1" });
await deleteByIds("messages", "local_id", localIds);
```

## Several writes that must succeed together
```ts
await transaction(async (txn) => {
  await insertOne("messages", row, { db: txn });
  await updateOne("chats", { unread_count: 0 }, { id: chatId }, txn);
});
```
Inside `transaction`, always pass `txn` (never call getDb() there, it would deadlock). Helpers called without `db` open their own transaction when they write many rows.

## Plug it into the socket / REST code
```ts
// incoming socket message
await saveMessage(message);
await applyLastMessage(message.chatId, message, { incrementUnread: !isActive });

// receipts from the server
await setStatusForServerIds(p.messageIds, p.status);

// sending: optimistic, then confirm
const msg = await createPending({ clientMessageId, chatId, senderId, receiverId, text, payload, asset });
... POST ...
await confirmSent(clientMessageId, data.message);     // or markFailed(clientMessageId, err.message)

// opening a chat (newest first, matches the inverted list), load older on scroll
const { messages, nextCursor } = await getChatMessages(chatId, { limit: 30 });
const more = await getChatMessages(chatId, { before: nextCursor! });

// full sync from the REST API
await saveChats(serverChats, user._id);
await saveMessages(serverMessages);
```

## Rules built in
- Identifiers (table, column, ORDER BY) are validated; every value is a bound parameter. Never concatenate user input into SQL.
- `updateOne`/`updateWhere`/`deleteOne`/`deleteWhere` refuse to run without a filter. Wipe a table only with `truncate()`.
- Lists in `where` (`{ id: [...] }`) become `IN (...)`. Keep them under ~500 items; `deleteByIds` and the receipt updates chunk for you.
- Statuses only move forward (`sent -> delivered -> read`), also in upserts, so a late event can't downgrade a message.
- Re-saving a message never overwrites a file's local download path.

## Tips
- Store reads in your zustand stores as a cache and treat SQLite as the source of truth: write to the DB first, then update the store from the returned rows.
- Page long lists (`limit` + cursor) instead of loading a whole chat.

---
## Identity model (camelCase schema)
| table | local key (PK) | server id |
|---|---|---|
| chats | `clientChatId` | `_id` (UNIQUE, NULL until synced) |
| files | `clientFileId` | `_id` (UNIQUE) |
| messages | `clientMessageId` | `_id` (UNIQUE) |

- Rows that come from the server get `clientXxxId = _id` unless the server echoes a client id.
- `messages.chatId` is a **clientChatId**. Functions that take a `chatKey` accept either id and resolve it.
- A message that arrives before its chat creates a **stub chat** (`ensureChats`); the next `saveChats` fills it in.
- A direct chat created locally (`getOrCreateDirectChat`) has no `_id`; `saveChats` matches it to the server chat by `peerId`.
- Repos return `chatId` = the server chat id when known, so your stores keep working.
