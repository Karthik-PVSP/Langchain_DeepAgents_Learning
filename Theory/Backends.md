

# Backend

`Definition` : Backend is the storage layer that controls how an agent manages files and persistent state

1) `we can choose different backends`
    1) StateBackend: 
        1) An Ephemeral Filesystem backend stored in `Langgraph` state.
        2) The file system only persists for a single thread.
    2) FileSystemBackend: 
        1) The local machines file system.
    3) LocalShellBackend: A filesystem `with shell execution` directly on the host. Provides filesystem tools plus the execute tool for running commands.
    
        > <span style="color: #eb6c6c">This backend grants agents direct filesystem read/write access and unrestricted shell execution on your host. Use with extreme caution and only in appropriate environments. For more information, see 
        >>[LocalShellBackend](https://docs.langchain.com/oss/javascript/deepagents/backends#localshellbackend-local-shell)</span>
    4) StoreBackend: A filesystem that provides long-term storage that is persisted across threads.

    5) CompositeBackend:
    A flexible backend where you can specify different routes in the filesystem to point towards different backends.