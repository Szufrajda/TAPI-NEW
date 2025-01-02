import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

// Poprawna ścieżka do pliku .proto
const packageDefinition = protoLoader.loadSync('./grpc/proto/perfume.proto');
const proto = grpc.loadPackageDefinition(packageDefinition);

// Tworzymy klienta
const client = new proto.perfume.PerfumeService(
    "127.0.0.1:9090",
    grpc.credentials.createInsecure()
);

// Wykonanie RPC
client.GetPerfume({ id: 1 }, (err, res) => {
    if (err) {
        console.error("Error:", err.message);
    } else {
        console.log("Perfume Data:", res);
    }
});